# FinTrack — Personal Finance Dashboard

A clean, interactive finance dashboard built with React, Vite, Tailwind CSS, and Recharts.

## Features

- **Dashboard Overview** — Summary cards (balance, income, expenses, savings rate), balance trend line chart, and spending donut chart by category
- **Transactions** — Full table with search, filter by type/category/month, column sorting, add/edit/delete, and CSV export
- **Role-Based UI** — Switch between Admin (full access) and Viewer (read-only) via the sidebar dropdown
- **Insights** — Monthly income vs expense bar chart, top spending categories, savings rate, and key financial observations
- **Persistence** — Transactions and roles are saved to localStorage and survive page refresh

## Tech Stack

- React 18 with Vite
- Tailwind CSS v3
- Recharts for data visualization
- Context API + useReducer for state management

## Getting Started

### Prerequisites

- Node.js 18+

### Installation
```bash
git clone <your-repo-url>
cd finance-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

