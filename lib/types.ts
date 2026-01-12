export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  taxRate: number;
  unit: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  notes: string;
  createdAt: Date;
  dueDate: Date;
}

export interface DashboardStats {
  totalInvoicesThisMonth: number;
  totalRevenueThisMonth: number;
  pendingInvoices: number;
  totalClients: number;
}
