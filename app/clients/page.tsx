'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Building2, Pencil, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import type { Client } from '@/lib/types';

const emptyForm = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingClient(null);
  };

  const openModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        companyName: client.companyName,
        contactName: client.contactName,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
        country: client.country,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData);
    }
    closeModal();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteClient(deleteId);
      setDeleteId(null);
    }
  };

  const getFullAddress = (client: Client) => {
    const parts = [client.address, client.city, client.state, client.zipCode, client.country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage your client companies"
        action={
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        }
      />

      {clients.length === 0 ? (
        <Card>
          <EmptyState
            icon={Building2}
            title="No clients yet"
            description="Add your first client to start creating invoices."
            action={
              <Button onClick={() => openModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Add New Card */}
          <button
            onClick={() => openModal()}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl hover:border-primary hover:bg-primary/5 transition-all min-h-[140px] sm:min-h-[180px] cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="font-medium text-muted-foreground group-hover:text-primary transition-colors">Add Client</p>
          </button>

          {/* Client Cards */}
          {clients.map((client) => (
            <Card 
              key={client.id} 
              className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
              onClick={() => openModal(client)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {client.companyName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{client.contactName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(client);
                      }}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                      aria-label="Edit client"
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, client.id)}
                      className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors"
                      aria-label="Delete client"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-danger" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {client.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {getFullAddress(client) && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{getFullAddress(client)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClient ? 'Edit Client' : 'Add Client'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Acme Corporation"
              required
              autoFocus
            />
            <Input
              label="Contact Name"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="John Smith"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@company.com"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Business Street"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Mumbai"
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="MH"
            />
            <Input
              label="PIN Code"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              placeholder="400001"
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="India"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Client"
        message="Are you sure you want to remove this client? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
