'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Your Company Name',
    email: 'contact@company.com',
    phone: '+1 (555) 000-0000',
    address: '123 Business Street',
    city: 'City',
    state: 'State',
    zipCode: '12345',
    country: 'USA',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend/localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your company information"
      />

      <div className="max-w-2xl">
        <Card>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">Company Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This information will appear on your invoices.
                </p>
                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    />
                    <Input
                      label="Phone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Input
                      label="City"
                      value={companyInfo.city}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
                    />
                    <Input
                      label="State"
                      value={companyInfo.state}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, state: e.target.value })}
                    />
                    <Input
                      label="ZIP Code"
                      value={companyInfo.zipCode}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, zipCode: e.target.value })}
                    />
                    <Input
                      label="Country"
                      value={companyInfo.country}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, country: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                {saved && (
                  <span className="text-sm text-success">Settings saved successfully</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
