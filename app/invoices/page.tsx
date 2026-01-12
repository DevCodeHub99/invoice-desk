'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, FileText, Lock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
  const [mounted, setMounted] = useState(false);
  const invoices = useStore((state) => state.invoices);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const recentInvoices = invoices.slice(0, 10);
  const archivedInvoices = invoices.slice(10);

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

  if (!mounted) {
    return (
      <div>
        <PageHeader
          title="Invoices"
          description="Create and manage your invoices"
          action={
            <LinkButton href="/invoices/new">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </LinkButton>
          }
        />
        <Card className="animate-pulse">
          <div className="p-6 space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create and manage your invoices"
        action={
          <LinkButton href="/invoices/new">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </LinkButton>
        }
      />

      {recentInvoices.length === 0 && archivedInvoices.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No invoices yet"
            description="Create your first invoice to get started with billing."
            action={
              <LinkButton href="/invoices/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </LinkButton>
            }
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Recent Invoices - Full Access */}
          {recentInvoices.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                Recent Invoices ({recentInvoices.length})
              </h2>
              <Card>
                <div className="divide-y">
                  {recentInvoices.map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/invoices/${invoice.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatCurrency(invoice.total)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</p>
                        </div>
                        {getStatusBadge(invoice.status)}
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Archived Invoices - Locked Summary View */}
          {archivedInvoices.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Archived ({archivedInvoices.length})
                </h2>
                <span className="text-xs text-muted-foreground/70 bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Summary only
                </span>
              </div>
              <Card className="bg-muted/30">
                <div className="divide-y divide-border/50">
                  {archivedInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between px-6 py-4 opacity-60"
                      title="Detailed view available for recent invoices only"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground/70">{invoice.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-muted-foreground">{formatCurrency(invoice.total)}</p>
                          <p className="text-xs text-muted-foreground/70">{formatDate(invoice.createdAt)}</p>
                        </div>
                        {getStatusBadge(invoice.status)}
                        <Lock className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
