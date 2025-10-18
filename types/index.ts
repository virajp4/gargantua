import { Database } from "./database.types";

// Public schema types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProjectAccess = Database["public"]["Tables"]["project_access"]["Row"];

// Gargantua schema types - Unified transactions table
export type Transaction = Database["gargantua"]["Tables"]["transactions"]["Row"];
export type TransactionInsert = Database["gargantua"]["Tables"]["transactions"]["Insert"];
export type TransactionUpdate = Database["gargantua"]["Tables"]["transactions"]["Update"];

export type WishlistItem = Database["gargantua"]["Tables"]["wishlist"]["Row"];
export type WishlistInsert = Database["gargantua"]["Tables"]["wishlist"]["Insert"];
export type WishlistUpdate = Database["gargantua"]["Tables"]["wishlist"]["Update"];

// Enums for easier usage and type safety
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export enum Necessity {
  WANT = 1,
  LIKE = 2,
  NEED = 3,
  IMPORTANT = 4,
  CRITICAL = 5,
}

export enum IncomeSource {
  SALARY = "Salary",
  FREELANCE = "Freelance",
  INVESTMENT = "Investment",
  GIFT = "Gift",
  OTHER = "Other",
}

export enum ExpenseCategory {
  FOOD = "Food",
  TRANSPORT = "Transport",
  ENTERTAINMENT = "Entertainment",
  BILLS = "Bills",
  SHOPPING = "Shopping",
  HEALTH = "Health",
  EDUCATION = "Education",
  TRAVEL = "Travel",
  OTHER = "Other",
}

export enum PaymentMethod {
  CASH = "Cash",
  CARD = "Card",
  UPI = "UPI",
  OTHER = "Other",
}

// Helper functions to generate options from enums
export const getTransactionTypeOptions = () => {
  return Object.values(TransactionType).map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));
};

export const getIncomeSourceOptions = () => {
  return Object.values(IncomeSource).map((value) => ({
    value,
    label: value,
  }));
};

export const getExpenseCategoryOptions = () => {
  return Object.values(ExpenseCategory).map((value) => ({
    value,
    label: value,
  }));
};

export const getPaymentMethodOptions = () => {
  return Object.values(PaymentMethod).map((value) => ({
    value,
    label: value,
  }));
};

export const getPriorityOptions = () => {
  return [
    { value: Priority.LOW, label: "Low" },
    { value: Priority.MEDIUM, label: "Medium" },
    { value: Priority.HIGH, label: "High" },
  ];
};

export const getNecessityOptions = () => {
  return [
    { value: Necessity.WANT, label: "Luxury" },
    { value: Necessity.NEED, label: "Need" },
    { value: Necessity.CRITICAL, label: "Critical" },
  ];
};

export const getPriorityLabel = (priority: number): string => {
  const option = getPriorityOptions().find((opt) => opt.value === priority);
  return option?.label || "";
};

export const getNecessityLabel = (necessity: number): string => {
  const option = getNecessityOptions().find((opt) => opt.value === necessity);
  return option?.label || "";
};
