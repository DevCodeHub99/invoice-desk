'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const InvoicePDF = dynamic(() => import('@/components/invoice/InvoicePDF'), { ssr: false });

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const invoices = useStore((state) => state.invoices);
  const updateInvoiceStatus = useStore((state) => state.updateInvoiceStatus);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const recentInvoices = invoices.slice(0, 10);
  const invoice = invoices.find((inv) => inv.id === id);
  const isRecent = recentInvoices.some((inv) => inv.id === id);

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-24 mb-4"></div>
        <div className="h-8 bg-muted rounded w-48 mb-2"></div>
        <div className="h-4 bg-muted rounded w-64"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Invoice not found.</p>
        <Link href="/invoices" className="text-primary hover:underline mt-2 inline-block">
          Back to Invoices
        </Link>
      </div>
    );
  }

  if (!isRecent) {
    router.push('/invoices');
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'sent':
        return <Badge variant="warning">Sent</Badge>;
      default:
        return <Badge variant="muted">Draft</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <Link href="/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{invoice.invoiceNumber}</h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Created {formatDate(invoice.createdAt)} · Due {formatDate(invoice.dueDate)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {invoice.status === 'draft' && (
              <Button variant="secondary" onClick={() => updateInvoiceStatus(invoice.id, 'sent')}>
                <Send className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Mark as</span> Sent
              </Button>
            )}
            {invoice.status === 'sent' && (
              <Button variant="secondary" onClick={() => updateInvoiceStatus(invoice.id, 'paid')}>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Mark as</span> Paid
              </Button>
            )}
            <InvoicePDF invoice={invoice} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Invoice Preview */}
          <Card>
            <CardContent className="p-4 sm:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">INVOICE</h2>
                  <p className="text-muted-foreground mt-1 text-sm">{invoice.invoiceNumber}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-semibold text-foreground text-sm sm:text-base">Your Company Name</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">123 Business Street</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">City, State 12345</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-6 sm:mb-8">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">BILL TO</p>
                <p className="font-semibold text-foreground text-sm sm:text-base">{invoice.clientName}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{invoice.clientAddress}</p>
              </div>

              {/* Dates */}
              <div className="flex flex-wrap gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Invoice Date</p>
                  <p className="text-foreground text-sm sm:text-base">{formatDate(invoice.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Due Date</p>
                  <p className="text-foreground text-sm sm:text-base">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>

              {/* Items - Mobile Cards / Desktop Table */}
              <div className="mb-6 sm:mb-8">
                {/* Mobile View */}
                <div className="sm:hidden space-y-3">
                  {invoice.items.map((item) => (
                    <div key={item.id} className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-medium text-foreground text-sm">{item.productName}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      )}
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</span>
                        <span className="font-medium text-foreground">{formatCurrency(item.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop Table */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Qty</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Tax</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3">
                          <p className="font-medium text-foreground">{item.productName}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </td>
                        <td className="py-3 text-right text-foreground">{item.quantity}</td>
                        <td className="py-3 text-right text-foreground">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right text-muted-foreground">{item.taxRate}%</td>
                        <td className="py-3 text-right font-medium text-foreground">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (GST)</span>
                    <span className="text-foreground">{formatCurrency(invoice.taxTotal)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-foreground">{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Notes</p>
                  <p className="text-xs sm:text-sm text-foreground">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardContent>
              <h3 className="font-medium text-foreground mb-4">Invoice Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium text-foreground">{invoice.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="font-medium text-foreground">{invoice.items.length} item(s)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-semibold text-foreground">{formatCurrency(invoice.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
