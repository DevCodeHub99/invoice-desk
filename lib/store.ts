'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Product, Client, Invoice } from './types';
import { seedProducts, seedClients, generateSeedInvoices } from './seed';

interface AppState {
  products: Product[];
  clients: Client[];
  invoices: Invoice[];
  seeded: boolean;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Invoice actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  deleteInvoice: (id: string) => void;
  
  // Helpers
  getNextInvoiceNumber: () => string;
  getRecentInvoices: () => Invoice[];
  getArchivedInvoices: () => Invoice[];
  
  // Seed
  loadSeedData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: [],
      clients: [],
      invoices: [],
      seeded: false,

      addProduct: (product) => set((state) => ({
        products: [...state.products, {
          ...product,
          id: uuidv4(),
          createdAt: new Date(),
        }],
      })),

      updateProduct: (id, product) => set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...product } : p
        ),
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),

      addClient: (client) => set((state) => ({
        clients: [...state.clients, {
          ...client,
          id: uuidv4(),
          createdAt: new Date(),
        }],
      })),

      updateClient: (id, client) => set((state) => ({
        clients: state.clients.map((c) =>
          c.id === id ? { ...c, ...client } : c
        ),
      })),

      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
      })),

      addInvoice: (invoice) => set((state) => ({
        invoices: [{
          ...invoice,
          id: uuidv4(),
          invoiceNumber: get().getNextInvoiceNumber(),
          createdAt: new Date(),
        }, ...state.invoices],
      })),

      updateInvoiceStatus: (id, status) => set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === id ? { ...inv, status } : inv
        ),
      })),

      updateInvoice: (id, invoice) => set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === id ? { ...inv, ...invoice } : inv
        ),
      })),

      deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
      })),

      getNextInvoiceNumber: () => {
        const invoices = get().invoices;
        const year = new Date().getFullYear();
        const count = invoices.filter(
          (inv) => new Date(inv.createdAt).getFullYear() === year
        ).length;
        return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
      },

      getRecentInvoices: () => {
        const invoices = get().invoices;
        return invoices.slice(0, 10);
      },

      getArchivedInvoices: () => {
        const invoices = get().invoices;
        return invoices.slice(10);
      },

      loadSeedData: () => {
        const state = get();
        if (state.seeded) return;
        
        const invoices = generateSeedInvoices(seedProducts, seedClients);
        set({
          products: seedProducts,
          clients: seedClients,
          invoices,
          seeded: true,
        });
      },
    }),
    {
      name: 'billing-storage',
    }
  )
);
