# 💰 Gargantua

> A modern, private personal finance tracker with smart automation

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 Overview

**Gargantua** is a private, single-user personal finance tracking application that helps you manage your income, expenses, and wishlist with real-time updates and smart automation. Track your spending, automate recurring transactions, and make smarter purchase decisions.

🌐 **Live Demo**: [gargantua.viraj.app](https://gargantua.viraj.app)

---

## ✨ Features

### 🔐 Authentication & Security

- Google OAuth authentication via Supabase
- Single-user access control with email/ID whitelisting
- Row-level security (RLS) policies

### 💸 Transaction Management

- Unified income & expense tracking
- Add, edit, delete with form validation
- Filter by type, category, recurring status
- Sort by date or amount
- Real-time updates across all views

### 🔄 Recurring Transactions

- Mark transactions as recurring (salary, rent, subscriptions)
- Auto-creates monthly duplicates
- Smart duplicate prevention
- Visual ♻️ badge indicators

### 🎯 Smart Wishlist

- Track items with purchase scoring
- Affordability calculator (priority + necessity + balance)
- Status indicators: "Buy Now" ✅ / "Consider" ⚠️ / "Save More" 💰
- Priority & necessity levels

### 📊 Dashboard

- Current balance & monthly stats
- Income/expense totals
- Savings rate calculation
- Real-time data

### 🎨 Modern UI/UX

- Responsive design (mobile-first)
- Dark mode ready
- Toast notifications
- Loading states & skeletons

---

## 🛠️ Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS 4, shadcn/ui, React Hook Form, Zod
**Backend:** Supabase (PostgreSQL, Auth, Realtime)
**Libraries:** date-fns, Lucide React, Recharts

---

## 📝 License

Private project for personal use.

---

## 🙏 Acknowledgments

Built with [Next.js](https://nextjs.org/), [Supabase](https://supabase.com/), [shadcn/ui](https://ui.shadcn.com/), and [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for better financial management**
