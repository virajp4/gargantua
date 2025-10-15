export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your personal finance tracker</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">This Month Income</p>
          <p className="text-2xl font-bold text-green-600">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">This Month Expenses</p>
          <p className="text-2xl font-bold text-red-600">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
          <p className="text-2xl font-bold">0%</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <p className="text-muted-foreground">
          No transactions yet. Start by adding income or expenses.
        </p>
      </div>
    </div>
  );
}
