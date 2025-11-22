import { formatCurrency } from "./formatting";

/**
 * Calculates the purchase score and affordability status for a wishlist item.
 * Formula Weights:
 * - Necessity: 40%
 * - Priority: 30%
 * - Affordability: 30%
 */
export function calculatePurchaseStatus(
  priority: number,
  necessity: number,
  cost: number,
  balance: number
) {
  const SAFE_SPEND_RATIO = 0.15;
  const safeSpendLimit = balance * SAFE_SPEND_RATIO;
  const isAffordable = balance >= cost;
  const isWithinSafeSpend = cost <= safeSpendLimit;
  const weights = {
    necessity: 0.4,
    priority: 0.3,
    affordability: 0.3,
  };

  const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin = 0,
    outMax = 10
  ) => ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  const necessityWeight = mapRange(necessity, 1, 5, 2, 10);
  const priorityWeight = mapRange(priority, 1, 3, 3.33, 10);

  const affordabilityWeight =
    cost <= safeSpendLimit
      ? 10
      : Math.max(0, 10 - ((cost - safeSpendLimit) / safeSpendLimit) * 5);

  const purchaseScore = Math.round(
    (necessityWeight * weights.necessity +
      priorityWeight * weights.priority +
      affordabilityWeight * weights.affordability) *
      10
  );

  let status: string;
  let statusColor: string;

  if (!isAffordable) {
    status = "Cannot Afford";
    statusColor =
      "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200";
  } else if (!isWithinSafeSpend) {
    status = `Exceeds Safe Limit (${formatCurrency(safeSpendLimit)})`;
    statusColor =
      "bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-200";
  } else if (purchaseScore >= 70) {
    status = "Good to Purchase";
    statusColor =
      "bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-200";
  } else {
    status = "Not Recommended";
    statusColor =
      "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200";
  }
  return { purchaseScore, status, statusColor };
}
