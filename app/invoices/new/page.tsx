'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatCurrency, calculateItemTotal } from '@/lib/utils';
import { Plus, Trash2, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import type { InvoiceItem } from '@/lib/types';

interface LineItem {
  id: string;
  productId: string;
  quantity: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const { clients, products, addInvoice } = useStore();
  const [clientId, setClientId] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ id: uuidv4(), productId: '', quantity: 1 }]);
  const [notes, setNotes] = useState('');
  const [dueInDays, setDueInDays] = useState('30');

  const selectedClient = clients.find((c) => c.id === clientId);

  const invoiceItems: InvoiceItem[] = useMemo(() => {
    return lineItems
      .filter((item) => item.productId)
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const { total } = calculateItemTotal(item.quantity, product.price, product.taxRate);
        return {
          id: item.id,
          productId: product.id,
          productName: product.name,
          description: product.description,
          quantity: item.quantity,
          unitPrice: product.price,
          taxRate: product.taxRate,
          total,
        };
      })
      .filter(Boolean) as InvoiceItem[];
  }, [lineItems, products]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let taxTotal = 0;
    invoiceItems.forEach((item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;
      taxTotal += itemSubtotal * (item.taxRate / 100);
    });
    return { subtotal, taxTotal, total: subtotal + taxTotal };
  }, [invoiceItems]);

  const addLineItem = () => {
    setLineItems([...lineItems, { id: uuidv4(), productId: '', quantity: 1 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || invoiceItems.length === 0) return;

    const client = clients.find((c) => c.id === clientId)!;
    const clientAddress = [client.address, client.city, client.state, client.zipCode, client.country]
      .filter(Boolean)
      .join(', ');

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(dueInDays));

    addInvoice({
      clientId: client.id,
      clientName: client.companyName,
      clientAddress,
      items: invoiceItems,
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      total: totals.total,
      status: 'draft',
      notes,
      dueDate,
    });

    router.push('/invoices');
  };

  const clientOptions = [
    { value: '', label: 'Select a client...' },
    ...clients.map((c) => ({ value: c.id, label: c.companyName })),
  ];

  const productOptions = [
    { value: '', label: 'Select a product...' },
    ...products.map((p) => ({ value: p.id, label: `${p.name} - ${formatCurrency(p.price)}` })),
  ];

  const canSubmit = clientId && invoiceItems.length > 0;

  return (
    <div>
      <div className="mb-6">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </Link>
        <PageHeader title="Create Invoice" description="Fill in the details to generate a new invoice" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Client Selection */}
            <Card>
              <CardContent>
                <h3 className="font-medium text-foreground mb-4">Client Information</h3>
                <Select
                  label="Select Client"
                  options={clientOptions}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                />
                {selectedClient && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">{selectedClient.companyName}</p>
                    {selectedClient.contactName && (
                      <p className="text-sm text-muted-foreground">{selectedClient.contactName}</p>
                    )}
                    {selectedClient.email && (
                      <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                    )}
                  </div>
                )}
                {clients.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No clients yet.{' '}
                    <Link href="/clients" className="text-primary hover:underline">
                      Add a client first
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardContent>
                <h3 className="font-medium text-foreground mb-4 text-sm sm:text-base">Invoice Items</h3>
                <div className="space-y-3">
                  {lineItems.map((item, index) => {
                    const product = products.find((p) => p.id === item.productId);
                    const itemTotal = product
                      ? calculateItemTotal(item.quantity, product.price, product.taxRate).total
                      : 0;

                    return (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 p-3 sm:p-0 bg-muted/30 sm:bg-transparent rounded-lg sm:rounded-none">
                        <div className="flex-1">
                          <Select
                            label={index === 0 || window.innerWidth < 640 ? 'Product' : undefined}
                            options={productOptions}
                            value={item.productId}
                            onChange={(e) => updateLineItem(item.id, 'productId', e.target.value)}
                          />
                        </div>
                        <div className="flex items-end gap-2 sm:gap-3">
                          <div className="w-20 sm:w-24">
                            <Input
                              label="Qty"
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="flex-1 sm:w-28 text-right">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1.5">Total</p>
                            <p className="h-10 flex items-center justify-end font-medium text-foreground text-sm sm:text-base">
                              {formatCurrency(itemTotal)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            className="h-10 p-2 rounded-lg hover:bg-danger/10 transition-colors disabled:opacity-30"
                            disabled={lineItems.length === 1}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4 text-danger" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button type="button" variant="secondary" onClick={addLineItem} className="mt-4 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                {products.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No products yet.{' '}
                    <Link href="/products" className="text-primary hover:underline">
                      Add products first
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent>
                <h3 className="font-medium text-foreground mb-4">Additional Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, thank you message, etc."
                  className="w-full h-24 px-3 py-2 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <Card className="lg:sticky lg:top-8">
              <CardContent>
                <h3 className="font-medium text-foreground mb-4">Invoice Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">{formatCurrency(totals.taxTotal)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="text-xl font-semibold text-foreground">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Select
                  label="Payment Due"
                  options={[
                    { value: '7', label: 'Due in 7 days' },
                    { value: '14', label: 'Due in 14 days' },
                    { value: '30', label: 'Due in 30 days' },
                    { value: '60', label: 'Due in 60 days' },
                  ]}
                  value={dueInDays}
                  onChange={(e) => setDueInDays(e.target.value)}
                />
                <Button type="submit" className="w-full mt-4" disabled={!canSubmit}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
