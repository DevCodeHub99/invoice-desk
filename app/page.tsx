'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/LinkButton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, TrendingUp, Clock, Building2, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { invoices, clients, products } = useStore();
  
  const now = new Date();
  const thisMonth = invoices.filter((inv) => {
    const invDate = new Date(inv.createdAt);
    return invDate.getMonth() === now.getMonth() && 
           invDate.getFullYear() === now.getFullYear();
  });
  
  const totalRevenueThisMonth = thisMonth.reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = invoices.filter((inv) => inv.status !== 'paid').length;
  const recentInvoices = invoices.slice(0, 5);

  const stats = [
    {
      label: 'Invoices This Month',
      value: thisMonth.length,
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
      href: '/invoices',
    },
    {
      label: 'Revenue This Month',
      value: formatCurrency(totalRevenueThisMonth),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
      href: '/invoices',
    },
    {
      label: 'Pending Invoices',
      value: pendingInvoices,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
      href: '/invoices',
    },
    {
      label: 'Total Clients',
      value: clients.length,
      icon: Building2,
      color: 'text-secondary-foreground',
      bg: 'bg-secondary',
      href: '/clients',
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your billing activity"
        action={
          <LinkButton href="/invoices/new">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </LinkButton>
        }
      />

      {/* Stats Cards - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block">
            <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer">
              <CardContent className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link 
          href="/invoices/new"
          className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Create Invoice</p>
            <p className="text-sm text-muted-foreground">Bill a client</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>

        <Link 
          href="/products"
          className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Products</p>
            <p className="text-sm text-muted-foreground">{products.length} items</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>

        <Link 
          href="/clients"
          className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md hover:border-primary/30 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Clients</p>
            <p className="text-sm text-muted-foreground">{clients.length} companies</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Recent Invoices */}
      <Card>
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Invoices</h2>
          <Link 
            href="/invoices" 
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div>
          {recentInvoices.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No invoices yet</p>
              <LinkButton href="/invoices/new">
                <Plus className="w-4 h-4 mr-2" />
                Create First Invoice
              </LinkButton>
            </div>
          ) : (
            <div className="divide-y">
              {recentInvoices.map((invoice, index) => {
                const isRecent = index < 10;
                return (
                  <Link
                    key={invoice.id}
                    href={isRecent ? `/invoices/${invoice.id}` : '/invoices'}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-foreground">{formatCurrency(invoice.total)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</p>
                      </div>
                      <Badge variant={
                        invoice.status === 'paid' ? 'success' : 
                        invoice.status === 'sent' ? 'warning' : 'muted'
                      }>
                        {invoice.status}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
