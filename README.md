# InvoiceDesk

B2B billing system for Indian small businesses.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

| Feature | Description |
|---------|-------------|
| 📦 Products | Add services/items with price & 18% GST |
| 🏢 Clients | Store Indian company details |
| 📄 Invoices | Create, manage & download PDF |
| 📊 Dashboard | Monthly revenue & stats overview |
| ⚙️ Settings | Company information |

## Invoice Rules

- **Last 10** → Full access, view, download PDF
- **Older** → Summary only, locked

## Pages

```
/              → Dashboard
/products      → Manage products/services
/clients       → Manage clients
/invoices      → All invoices
/invoices/new  → Create invoice
/invoices/[id] → Invoice detail & PDF
/settings      → Company info
```

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Zustand (localStorage persistence)
- React-PDF (invoice generation)
- Lucide React (icons)

## Currency

All amounts displayed in INR (₹) with Indian number formatting.

## Sample Data

App loads with demo data on first run:
- 6 products/services
- 5 Indian companies (TCS, Infosys, etc.)
- 15 sample invoices

To reset: Clear browser localStorage.
