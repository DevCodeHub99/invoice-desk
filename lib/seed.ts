import { v4 as uuidv4 } from 'uuid';

export const seedProducts = [
  {
    id: uuidv4(),
    name: 'Web Development',
    description: 'Full-stack custom web application development',
    price: 75000,
    taxRate: 18,
    unit: 'project',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'UI/UX Design',
    description: 'User interface and experience design',
    price: 2500,
    taxRate: 18,
    unit: 'hour',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Technical Consulting',
    description: 'Architecture review and technical guidance',
    price: 3500,
    taxRate: 18,
    unit: 'hour',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Website Maintenance',
    description: 'Monthly maintenance and support package',
    price: 15000,
    taxRate: 18,
    unit: 'month',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'SEO Services',
    description: 'Search engine optimization and analytics',
    price: 25000,
    taxRate: 18,
    unit: 'month',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application',
    price: 150000,
    taxRate: 18,
    unit: 'project',
    createdAt: new Date(),
  },
];

export const seedClients = [
  {
    id: uuidv4(),
    companyName: 'Tata Consultancy Services',
    contactName: 'Rajesh Kumar',
    email: 'rajesh.kumar@tcs.com',
    phone: '+91 98765 43210',
    address: '9th Floor, Nirmal Building, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400021',
    country: 'India',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    companyName: 'Infosys Technologies',
    contactName: 'Priya Sharma',
    email: 'priya.sharma@infosys.com',
    phone: '+91 98765 43211',
    address: '44 Electronics City, Hosur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560100',
    country: 'India',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    companyName: 'Reliance Industries',
    contactName: 'Amit Patel',
    email: 'amit.patel@ril.com',
    phone: '+91 98765 43212',
    address: 'Maker Chambers IV, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400021',
    country: 'India',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    companyName: 'Wipro Limited',
    contactName: 'Sneha Reddy',
    email: 'sneha.reddy@wipro.com',
    phone: '+91 98765 43213',
    address: 'Doddakannelli, Sarjapur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560035',
    country: 'India',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    companyName: 'HCL Technologies',
    contactName: 'Vikram Singh',
    email: 'vikram.singh@hcl.com',
    phone: '+91 98765 43214',
    address: 'Plot 3A, Sector 126',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zipCode: '201303',
    country: 'India',
    createdAt: new Date(),
  },
];

export function generateSeedInvoices(products: typeof seedProducts, clients: typeof seedClients) {
  const invoices = [];
  const statuses: ('draft' | 'sent' | 'paid')[] = ['paid', 'paid', 'paid', 'sent', 'sent', 'draft'];
  const notes = [
    'Thank you for your business!',
    'Payment due within 30 days. GST included.',
    'For queries, contact accounts@company.com',
    '',
  ];
  
  for (let i = 0; i < 15; i++) {
    const client = clients[i % clients.length];
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - i * 2);
    
    const dueDate = new Date(createdAt);
    dueDate.setDate(dueDate.getDate() + 30);

    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let subtotal = 0;
    let taxTotal = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[(i + j) % products.length];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const itemSubtotal = product.price * quantity;
      const itemTax = itemSubtotal * (product.taxRate / 100);
      
      items.push({
        id: uuidv4(),
        productId: product.id,
        productName: product.name,
        description: product.description,
        quantity,
        unitPrice: product.price,
        taxRate: product.taxRate,
        total: itemSubtotal + itemTax,
      });
      
      subtotal += itemSubtotal;
      taxTotal += itemTax;
    }

    invoices.push({
      id: uuidv4(),
      invoiceNumber: `INV-2026-${String(15 - i).padStart(4, '0')}`,
      clientId: client.id,
      clientName: client.companyName,
      clientAddress: `${client.address}, ${client.city}, ${client.state} ${client.zipCode}`,
      items,
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
      status: statuses[i % statuses.length],
      notes: notes[i % notes.length],
      createdAt,
      dueDate,
    });
  }

  return invoices;
}
