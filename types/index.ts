import { Database } from "./database.types";

// Public schema types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProjectAccess = Database["public"]["Tables"]["project_access"]["Row"];

// Gargantua schema types
export type Income = Database["gargantua"]["Tables"]["income"]["Row"];
export type Expense = Database["gargantua"]["Tables"]["expenses"]["Row"];
export type WishlistItem = Database["gargantua"]["Tables"]["wishlist"]["Row"];
export type UserSettings = Database["gargantua"]["Tables"]["user_settings"]["Row"];

// Insert types
export type IncomeInsert = Database["gargantua"]["Tables"]["income"]["Insert"];
export type ExpenseInsert = Database["gargantua"]["Tables"]["expenses"]["Insert"];
export type WishlistInsert = Database["gargantua"]["Tables"]["wishlist"]["Insert"];
export type UserSettingsInsert = Database["gargantua"]["Tables"]["user_settings"]["Insert"];

// Update types
export type IncomeUpdate = Database["gargantua"]["Tables"]["income"]["Update"];
export type ExpenseUpdate = Database["gargantua"]["Tables"]["expenses"]["Update"];
export type WishlistUpdate = Database["gargantua"]["Tables"]["wishlist"]["Update"];
export type UserSettingsUpdate = Database["gargantua"]["Tables"]["user_settings"]["Update"];

// Enums for easier usage and type safety
export enum Priority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum IncomeSource {
  SALARY = "salary",
  FREELANCE = "freelance",
  INVESTMENT = "investment",
  GIFT = "gift",
  OTHER = "other",
}

export enum ExpenseCategory {
  FOOD = "food",
  TRANSPORT = "transport",
  ENTERTAINMENT = "entertainment",
  BILLS = "bills",
  SHOPPING = "shopping",
  HEALTH = "health",
  EDUCATION = "education",
  OTHER = "other",
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  UPI = "upi",
  BANK_TRANSFER = "bank_transfer",
  OTHER = "other",
}
