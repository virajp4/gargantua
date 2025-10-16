# Gargantua - Private Personal Finance Tracker

## Overview

Gargantua is a private personal finance application that allows you to track your spending, balance, analyze expenses, and maintain a wishlist. The app is designed for single-user access with authentication via Supabase.

---

## Core Features & Functionalities

### 1. Authentication & Security (Supabase)

- **Google OAuth** - Quick sign-in with Google account
- **Email/Password** - Traditional username/password authentication
- **Single-User Authorization** - Whitelist your email/user ID in environment variables
- **Access Control Middleware** - Check if logged-in user matches the authorized user
- **Unauthorized Access Page** - Custom "Access Denied" page for unauthorized users
- **Session Management** - Secure session handling with automatic logout

### 2. Dashboard (Home Page)

- **Account Balance Card** - Current total balance (income - expenses)
- **Quick Stats**:
  - Total Income (current month)
  - Total Expenses (current month)
  - Savings Rate (percentage)
  - Budget utilization
- **Recent Transactions** - Last 5-10 transactions
- **Monthly Summary Chart** - Visual representation of income vs expenses
- **Quick Actions** - Buttons to add income/expense/wishlist item

### 3. Income Management

- **Add Income**:
  - Amount
  - Source (salary, freelance, investment, gift, other)
  - Date
  - Description/Notes
  - Category (optional)
- **View All Income** - Filterable list with search
- **Edit Income** - Modify existing entries
- **Delete Income** - Remove entries with confirmation
- **Income Categories** - Customizable categories

### 4. Expense Tracking

- **Add Expense**:
  - Amount
  - Category (food, transport, entertainment, bills, shopping, health, education, other)
  - Date
  - Payment method (cash, card, UPI, etc.)
  - Description/Notes
  - Recurring flag (optional)
- **View All Expenses** - Filterable and sortable list
- **Edit Expense** - Modify existing entries
- **Delete Expense** - Remove with confirmation
- **Expense Categories** - Customizable with color coding
- **Recurring Expenses** - Mark and track subscriptions/bills

### 5. Wishlist Feature

- **Add Wishlist Item** (Simplified to 4 fields):
  - Item name
  - Cost
  - Priority (1-3: Low, Medium, High)
  - Necessity (1-5: Want, Like, Need, Important, Critical)
- **Smart Purchase Score System**:
  - Calculates score based on (priority × necessity) / cost_ratio
  - Normalized to 0-10 scale
  - Shows affordability: balance >= cost
  - Displays status: "Buy Now" (✅), "Consider" (⚠️), "Low Priority" (⏸️), or "Save ₹X more" (💰)
  - Shows balance after purchase
- **Integrated into Dashboard** - Displayed as table below transactions
- **Priority and Necessity Badges** - Color-coded visual indicators
- **Edit/Delete Wishlist Items** - Full CRUD operations
- **No Separate Page** - All wishlist features in main dashboard

### 6. Analytics & Reports

- **Spending by Category** - Pie/donut chart
- **Income vs Expenses Trend** - Line chart (last 6-12 months)
- **Monthly Comparison** - Bar chart comparing months
- **Category-wise Monthly Breakdown** - Detailed analysis
- **Custom Date Range Reports** - Filter by any date range
- **Top Spending Categories** - Identify where most money goes
- **Savings Trend** - Track savings over time

### 7. Budget Management (Optional Enhancement)

- **Set Monthly Budget** - Overall and per category
- **Budget Alerts** - Warn when approaching limit
- **Budget Progress Bars** - Visual budget utilization
- **Budget vs Actual Comparison**

### 8. Settings & Preferences

- **Profile Settings** - Name, email (view only)
- **Currency Selection** - Default currency
- **Date Format** - Preference for date display
- **Custom Categories** - Add/edit/delete categories
- **Theme Toggle** - Light/dark mode

---

## Tech Stack

### Frontend

- **Next.js 14+** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components:
  - Forms (input, select, textarea, date-picker)
  - Dialogs/Modals
  - Tables with sorting/filtering
  - Cards
  - Charts (via Recharts integration)
  - Buttons, badges, alerts
  - Dropdown menus
  - Tabs
  - Toast notifications

### Backend & Database

- **Supabase**:
  - PostgreSQL database
  - Authentication (Google OAuth + Email/Password)
  - Row Level Security (RLS) policies
  - Real-time subscriptions (optional)
  - Storage (for future receipt uploads)

---

## Database Schema

### Tables

#### 1. profiles

```sql
- id (uuid, references auth.users)
- email (text)
- full_name (text)
- currency (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. transactions

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- type (text: 'income' or 'expense')
- amount (decimal)
- date (date)
- category (text, nullable)
- description (text, nullable)
- source (text, nullable - for income)
- payment_method (text, nullable - for expenses)
- is_recurring (boolean, default false - for expenses)
- created_at (timestamp)
- updated_at (timestamp)
```

**Note**: The `transactions` table consolidates both income and expenses into a single unified table with a `type` field to distinguish between them. Income-specific fields (source) and expense-specific fields (payment_method, is_recurring) are nullable.

#### 4. wishlist

```sql
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- item_name (text)
- cost (decimal)
- priority (integer: 1-3) -- 1=Low, 2=Medium, 3=High
- necessity (integer: 1-5) -- 1=Want, 2=Like, 3=Need, 4=Important, 5=Critical
- is_purchased (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. categories (optional, for custom categories)

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- name (text)
- type (enum: income, expense)
- color (text)
- created_at (timestamp)
```

#### 6. budgets (optional enhancement)

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- category (text)
- amount (decimal)
- month (date)
- created_at (timestamp)
```

---

## Project Structure

```
gargantua/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── unauthorized/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Protected layout with auth check
│   │   ├── page.tsx            # Dashboard home (unified transactions + wishlist)
│   │   ├── analytics/
│   │   │   └── page.tsx        # Analytics & reports
│   │   └── settings/
│   │       └── page.tsx        # Settings & preferences
│   ├── api/
│   │   └── auth/               # Supabase auth callbacks
│   │       └── callback/
│   │           └── route.ts
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dialogs/
│   │   ├── IncomeDialog.tsx
│   │   ├── ExpenseDialog.tsx
│   │   ├── WishlistDialog.tsx
│   │   └── DeleteConfirmationDialog.tsx
│   ├── layout/
│   │   └── navbar.tsx
│   └── dashboard/
│       ├── StatsOverview.tsx
│       ├── StatsCard.tsx
│       ├── TransactionFilters.tsx
│       └── TransactionsTable.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase client
│   │   ├── server.ts           # Server-side Supabase client
│   │   ├── middleware.ts       # Auth middleware
│   │   └── helpers.ts          # Schema helpers
│   ├── services/
│   │   └── transactions.ts     # Transaction service layer
│   ├── utils.ts                # Utility functions
│   └── validations.ts          # Form validation schemas
├── hooks/
│   ├── useTransactions.ts          # Unified hook for income & expenses
│   ├── useTransactionDialogs.ts    # Dialog state management
│   ├── useRealtimeTransactions.ts  # Real-time subscriptions
│   ├── useDashboardStats.ts        # Dashboard statistics
│   ├── useWishlist.ts              # Wishlist management
│   └── use-auth.ts
├── types/
│   ├── database.ts             # Database types
│   └── index.ts                # Shared types
├── public/
│   └── images/
├── .env.local                  # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Single-User Access Control

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_AUTHORIZED_EMAIL=your-email@gmail.com
# OR
NEXT_PUBLIC_AUTHORIZED_USER_ID=uuid-from-supabase
```

### Middleware Implementation

```typescript
// lib/supabase/middleware.ts
export async function checkAuthorization(userId: string, email: string) {
  const authorizedEmail = process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL;
  const authorizedUserId = process.env.NEXT_PUBLIC_AUTHORIZED_USER_ID;

  return email === authorizedEmail || userId === authorizedUserId;
}
```

---

## Implementation Phases

### Phase 1: Project Setup & Infrastructure

1. Initialize Next.js 14+ project with TypeScript
2. Install dependencies (Tailwind, shadcn/ui, Supabase client)
3. Configure Supabase project and get credentials
4. Set up environment variables
5. Initialize shadcn/ui components

**Commands:**

```bash
npx create-next-app@latest gargantua --typescript --tailwind --app
cd gargantua
npx shadcn-ui@latest init
npm install @supabase/supabase-js @supabase/ssr
```

### Phase 2: Authentication & Authorization

1. Create Supabase auth configuration (Google OAuth + Email/Password)
2. Build login page with both auth methods
3. Implement single-user authorization middleware
4. Create unauthorized access page
5. Set up protected route layout

**Key Files:**

- `app/(auth)/login/page.tsx`
- `app/(auth)/unauthorized/page.tsx`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`

### Phase 3: Database Schema

1. Create Supabase tables (profiles, income, expenses, wishlist)
2. Set up Row Level Security (RLS) policies
3. Create database indexes for performance

**RLS Policy Example:**

```sql
-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Phase 4: Core Features (MVP)

1. Build dashboard with balance and quick stats
2. Implement Income CRUD (forms, list, edit/delete)
3. Implement Expense CRUD (forms, list, edit/delete)
4. Create Wishlist feature with affordability calculator
5. Add navigation and layout components

**Key Components:**

- Dashboard: `app/(dashboard)/page.tsx` (unified transactions view)
- Wishlist: `app/(dashboard)/wishlist/page.tsx`
- Settings: `app/(dashboard)/settings/page.tsx`

### Phase 5: Analytics & Enhancement

1. Build analytics page with charts (spending by category, trends)
2. Add filtering and search functionality
3. Create settings page (profile, categories, preferences)
4. Add dark mode support

**Key Features:**

- Recharts integration for data visualization
- Advanced filtering with date ranges
- Custom category management
- Theme switcher (light/dark mode)

### Phase 6: Polish & Deployment

1. Add loading states and error handling
2. Implement toast notifications
3. Ensure responsive design
4. Add form validations
5. Deploy to Vercel

**Polish Checklist:**

- Loading skeletons for async data
- Error boundaries for graceful error handling
- Toast notifications for user feedback
- Mobile-responsive design
- Form validation with Zod
- Accessibility improvements (ARIA labels, keyboard navigation)

---

## Security Considerations

- Environment variable for authorized user email/ID
- Supabase RLS policies to ensure data isolation
- Server-side authorization checks
- Secure session management
- HTTPS only in production
- Input validation and sanitization
- SQL injection prevention (Supabase handles this)

---

## UI/UX Highlights

- Clean, minimal dashboard
- Responsive design (mobile-first)
- Loading states and skeletons
- Error handling with toast notifications
- Confirmation dialogs for deletions
- Form validation with helpful error messages
- Keyboard shortcuts for power users
- Accessibility (ARIA labels, keyboard navigation)

---

## Key Formulas & Calculations

### Balance Calculation

```typescript
balance = totalIncome - totalExpenses;
```

### Savings Rate

```typescript
savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
```

### Wishlist Purchase Score & Affordability

```typescript
isAffordable = currentBalance >= cost;
amountNeeded = cost - currentBalance;
balanceAfterPurchase = currentBalance - cost;

costRatio = Math.min(cost / Math.max(balance, 1), 2);
rawScore = (priority * necessity) / costRatio;
purchaseScore = Math.min((rawScore / 15) * 10, 10);

if (!isAffordable) status = "Save More";
else if (purchaseScore >= 7) status = "Buy Now";
else if (purchaseScore >= 4) status = "Consider";
else status = "Low Priority";
```

### Budget Utilization

```typescript
budgetUtilization = (totalExpenses / totalBudget) * 100;
```

---

## shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add form
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
```

---

## Additional Dependencies

```bash
# Charts
npm install recharts

# Form validation
npm install zod react-hook-form @hookform/resolvers

# Date handling
npm install date-fns

# Icons
npm install lucide-react

# Utilities
npm install clsx tailwind-merge
```

---

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase project and get credentials
4. Configure environment variables in `.env.local`
5. Run development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set environment variables in Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_AUTHORIZED_EMAIL`

---

## License

Private project for personal use only.
