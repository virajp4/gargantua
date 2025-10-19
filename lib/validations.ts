import { z } from "zod";

export const incomeSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  source: z.string().min(1, "Source is required"),
  category: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  isRecurring: z.boolean().optional(),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  isRecurring: z.boolean().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

export const wishlistSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  cost: z.number().positive("Cost must be positive"),
  priority: z.number().int().min(1).max(3, "Priority must be between 1-3"),
  necessity: z.number().int().min(1).max(5, "Necessity must be between 1-5"),
});

export type WishlistFormData = z.infer<typeof wishlistSchema>;
