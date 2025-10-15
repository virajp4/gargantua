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

- **Add Wishlist Item**:
  - Item name
  - Estimated cost
  - Priority (high, medium, low)
  - Target date (optional)
  - Link/URL (optional)
  - Notes
- **Affordability Calculator**:
  - Check if item is affordable based on current balance
  - Show "Can Buy Now" or "Save X more needed"
  - Calculate impact on balance after purchase
- **Priority Sorting** - Sort by priority, cost, or date
- **Convert to Expense** - Mark as purchased and automatically add to expenses
- **Edit/Delete Wishlist Items**
- **Savings Goal Tracker** - Track progress toward wishlist items

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

#### 2. income

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- amount (decimal)
- source (text)
- category (text)
- date (date)
- description (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3. expenses

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- amount (decimal)
- category (text)
- payment_method (text)
- date (date)
- description (text)
- is_recurring (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. wishlist

```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- item_name (text)
- estimated_cost (decimal)
- priority (enum: high, medium, low)
- target_date (date, nullable)
- url (text, nullable)
- notes (text)
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
│   │   ├── page.tsx            # Dashboard home
│   │   ├── income/
│   │   │   └── page.tsx        # Income management
│   │   ├── expenses/
│   │   │   └── page.tsx        # Expense tracking
│   │   ├── wishlist/
│   │   │   └── page.tsx        # Wishlist feature
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
│   ├── forms/
│   │   ├── income-form.tsx
│   │   ├── expense-form.tsx
│   │   └── wishlist-form.tsx
│   ├── charts/
│   │   ├── spending-chart.tsx
│   │   ├── trend-chart.tsx
│   │   └── category-chart.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── dashboard/
│       ├── balance-card.tsx
│       ├── quick-stats.tsx
│       └── recent-transactions.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase client
│   │   ├── server.ts           # Server-side Supabase client
│   │   └── middleware.ts       # Auth middleware
│   ├── utils.ts                # Utility functions
│   └── validations.ts          # Form validation schemas
├── hooks/
│   ├── use-income.ts
│   ├── use-expenses.ts
│   ├── use-wishlist.ts
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
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own income
CREATE POLICY "Users can view own income"
  ON income FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own income
CREATE POLICY "Users can insert own income"
  ON income FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Phase 4: Core Features (MVP)

1. Build dashboard with balance and quick stats
2. Implement Income CRUD (forms, list, edit/delete)
3. Implement Expense CRUD (forms, list, edit/delete)
4. Create Wishlist feature with affordability calculator
5. Add navigation and layout components

**Key Components:**

- Dashboard: `app/(dashboard)/page.tsx`
- Income: `app/(dashboard)/income/page.tsx`
- Expenses: `app/(dashboard)/expenses/page.tsx`
- Wishlist: `app/(dashboard)/wishlist/page.tsx`

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

### Wishlist Affordability

```typescript
canAfford = currentBalance >= estimatedCost;
amountNeeded = estimatedCost - currentBalance;
balanceAfterPurchase = currentBalance - estimatedCost;
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
