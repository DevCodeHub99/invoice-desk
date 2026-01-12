'use client';

import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import type { Invoice } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  companyAddress: {
    color: '#64748b',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  clientName: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  clientAddress: {
    color: '#64748b',
    lineHeight: 1.5,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 24,
  },
  dateBlock: {},
  dateLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
  },
  dateValue: {
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableCell: {
    fontSize: 10,
  },
  descCol: { width: '40%' },
  qtyCol: { width: '10%', textAlign: 'right' },
  priceCol: { width: '20%', textAlign: 'right' },
  taxCol: { width: '10%', textAlign: 'right' },
  totalCol: { width: '20%', textAlign: 'right' },
  productName: {
    fontFamily: 'Helvetica-Bold',
  },
  productDesc: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  totalsContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  totalsBox: {
    width: 200,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalsLabel: {
    color: '#64748b',
  },
  totalsValue: {},
  totalsFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalsFinalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  totalsFinalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
  },
  notes: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  notesLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  notesText: {
    color: '#475569',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 9,
  },
});

import { formatCurrency } from '@/lib/utils';

function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

function InvoiceDocument({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Your Company Name</Text>
            <Text style={styles.companyAddress}>123 Business Street</Text>
            <Text style={styles.companyAddress}>City, State 12345</Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bill To</Text>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
          <Text style={styles.clientAddress}>{invoice.clientAddress}</Text>
        </View>

        {/* Dates */}
        <View style={styles.datesRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Invoice Date</Text>
            <Text style={styles.dateValue}>{formatDateLong(invoice.createdAt)}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Due Date</Text>
            <Text style={styles.dateValue}>{formatDateLong(invoice.dueDate)}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.descCol]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.qtyCol]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.priceCol]}>Price</Text>
            <Text style={[styles.tableHeaderCell, styles.taxCol]}>Tax</Text>
            <Text style={[styles.tableHeaderCell, styles.totalCol]}>Total</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.descCol}>
                <Text style={styles.productName}>{item.productName}</Text>
                {item.description && <Text style={styles.productDesc}>{item.description}</Text>}
              </View>
              <Text style={[styles.tableCell, styles.qtyCol]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.priceCol]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, styles.taxCol]}>{item.taxRate}%</Text>
              <Text style={[styles.tableCell, styles.totalCol]}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.taxTotal)}</Text>
            </View>
            <View style={styles.totalsFinal}>
              <Text style={styles.totalsFinalLabel}>Total</Text>
              <Text style={styles.totalsFinalValue}>{formatCurrency(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your business</Text>
      </Page>
    </Document>
  );
}

export default function InvoicePDF({ invoice }: { invoice: Invoice }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Valid pattern for client-side hydration detection
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<InvoiceDocument invoice={invoice} />}
      fileName={`${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download PDF
        </Button>
      )}
    </PDFDownloadLink>
  );
}
