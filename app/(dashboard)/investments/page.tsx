"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createInvestmentService } from "@/lib/services/investments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Pencil } from "lucide-react";

type InvestmentRow = {
  year: number;
  contribution: number;
  investedAmount: number;
  yearlyReturn: number;
  monthlyReturn: number;
  totalMarketValue: number;
};

export default function InvestmentsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  // Form State
  const [yearlyAmount, setYearlyAmount] = useState<number>(0);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [investedDuration, setInvestedDuration] = useState<number>(10);
  const [totalDuration, setTotalDuration] = useState<number>(10);

  // Calculated Data
  const [tableData, setTableData] = useState<InvestmentRow[]>([]);

  const supabase = createClient();
  const investmentService = createInvestmentService(supabase);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    calculateTable();
  }, [yearlyAmount, returnRate, investedDuration, totalDuration]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await investmentService.getInvestmentSettings();
      if (settings) {
        setYearlyAmount(settings.yearly_amount);
        setReturnRate(settings.return_rate);
        setInvestedDuration(settings.invested_duration);
        setTotalDuration(settings.total_duration);
      }
    } catch (error) {
      console.error("Failed to load investment settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (totalDuration < investedDuration) {
      toast.error(
        "Total duration must be greater than or equal to invested duration"
      );
      return;
    }

    try {
      setSaving(true);
      await investmentService.updateInvestmentSettings({
        yearly_amount: yearlyAmount,
        return_rate: returnRate,
        invested_duration: investedDuration,
        total_duration: totalDuration,
      });
      setIsEditingConfig(false);
    } catch (error) {
      console.error("Failed to save settings", error);
    } finally {
      setSaving(false);
    }
  };

  const calculateTable = () => {
    const data: InvestmentRow[] = [];
    let investedSoFar = 0;
    let marketValue = 0;
    const rate = returnRate / 100;

    for (let year = 1; year <= totalDuration; year++) {
      const contribution = year <= investedDuration ? yearlyAmount : 0;

      // Start of year balance (previous MV + new contribution)
      const beginBalance = marketValue + contribution;

      // End of year balance (after interest)
      const endBalance = beginBalance * (1 + rate);

      // Interest earned this year
      const yearlyReturn = endBalance - beginBalance; // Interest only

      // Update accumulating values
      investedSoFar += contribution;
      marketValue = endBalance;

      data.push({
        year,
        contribution,
        investedAmount: investedSoFar,
        yearlyReturn: yearlyReturn, // This is purely the interest component
        monthlyReturn: yearlyReturn / 12,
        totalMarketValue: marketValue,
      });
    }

    setTableData(data);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Investment Tracker</h1>
        <p className="text-muted-foreground">
          Track your yearly investments and calculate future returns.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-semibold">Configuration</h2>
            {isEditingConfig ? (
              <Button onClick={handleSave} disabled={saving} size="icon">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditingConfig(true)}
                variant="outline"
                size="icon"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-muted-foreground">
                Yearly Investment
              </Label>
              {isEditingConfig ? (
                <Input
                  id="amount"
                  type="number"
                  value={yearlyAmount || ""}
                  onChange={(e) => setYearlyAmount(Number(e.target.value))}
                  placeholder="e.g. 100000"
                />
              ) : (
                <p className="text-xl font-semibold">
                  {formatMoney(yearlyAmount)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate" className="text-muted-foreground">
                Expected Return (%)
              </Label>
              {isEditingConfig ? (
                <Input
                  id="rate"
                  type="number"
                  value={returnRate || ""}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  placeholder="e.g. 12"
                />
              ) : (
                <p className="text-xl font-semibold">{returnRate}%</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="investedDuration"
                className="text-muted-foreground"
              >
                Invested Duration (Years)
              </Label>
              {isEditingConfig ? (
                <Input
                  id="investedDuration"
                  type="number"
                  value={investedDuration || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setInvestedDuration(val);
                    if (val > totalDuration) setTotalDuration(val);
                  }}
                  placeholder="e.g. 10"
                />
              ) : (
                <p className="text-xl font-semibold">
                  {investedDuration} years
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalDuration" className="text-muted-foreground">
                Total Duration (Years)
              </Label>
              {isEditingConfig ? (
                <Input
                  id="totalDuration"
                  type="number"
                  value={totalDuration || ""}
                  onChange={(e) => setTotalDuration(Number(e.target.value))}
                  placeholder="e.g. 30"
                />
              ) : (
                <p className="text-xl font-semibold">{totalDuration} years</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Projections</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-center">Year</TableHead>
                <TableHead className="w-20 text-center">Age</TableHead>
                <TableHead className="text-center">Contribution</TableHead>
                <TableHead className="text-center">Total Invested</TableHead>
                <TableHead className="text-right">Yearly Return</TableHead>
                <TableHead className="text-right">Monthly Return</TableHead>
                <TableHead className="text-right">Total Market Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.year}>
                  <TableCell className="font-medium text-center">
                    {row.year}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {row.year + 23}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatMoney(row.contribution)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatMoney(row.investedAmount)}
                  </TableCell>
                  <TableCell className="text-green-600 text-right">
                    {formatMoney(row.yearlyReturn)}
                  </TableCell>
                  <TableCell className="text-green-600 text-right">
                    {formatMoney(row.monthlyReturn)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatMoney(row.totalMarketValue)}
                  </TableCell>
                </TableRow>
              ))}
              {tableData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Enter investment details to see projections
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
