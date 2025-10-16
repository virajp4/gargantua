/**
 * Helper to get the schema name from environment
 * For gargantua project, this returns "gargantua"
 */
export function getSchemaName(): string {
  return process.env.NEXT_PUBLIC_PROJECT_NAME || "gargantua";
}
