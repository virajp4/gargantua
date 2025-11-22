/**
 * Get category color for badges
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    // Expense categories
    food: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    transport:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    entertainment:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
    bills: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    shopping:
      "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300",
    health:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    education:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    travel: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300",
    other: "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300",
    // Priority levels
    high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    medium:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    low: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    // Recurring
    recurring:
      "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300",
  };
  return category
    ? colors[category.toLowerCase()]
    : "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300";
}

/**
 * Utility: Get badge color for priority level.
 */
export function getPriorityColor(priority: number): string {
  const colors: Record<number, string> = {
    1: "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300",
    2: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    3: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };
  return colors[priority] ?? colors[1];
}

/**
 * Utility: Get badge color for necessity level.
 */
export function getNecessityColor(necessity: number): string {
  const colors: Record<number, string> = {
    1: "bg-gray-100 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300",
    2: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    3: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    4: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    5: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };
  return colors[necessity] ?? colors[1];
}
