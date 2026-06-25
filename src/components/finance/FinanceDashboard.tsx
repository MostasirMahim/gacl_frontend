"use client";
import { useState } from "react";
import useGetProfitLoss from "@/hooks/data/useGetProfitLoss";
import useGetExpenseBreakdown from "@/hooks/data/useGetExpenseBreakdown";
import useGetIncomeBreakdown from "@/hooks/data/useGetIncomeBreakdown";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LoadingDots } from "@/components/ui/loading";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

function StatCard({ label, value, icon, tone }: any) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${tone}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">BDT {value}</p>
      </div>
    </Card>
  );
}

function FinanceDashboard() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [appliedStart, setAppliedStart] = useState<string | undefined>();
  const [appliedEnd, setAppliedEnd] = useState<string | undefined>();
  const [by, setBy] = useState<"category" | "module">("module");

  const { data: plData, isLoading } = useGetProfitLoss(appliedStart, appliedEnd);
  const { data: expenseData } = useGetExpenseBreakdown(by, appliedStart, appliedEnd);
  const { data: incomeData } = useGetIncomeBreakdown(appliedStart, appliedEnd);

  const pl = plData?.data;
  const expenseBreakdown = expenseData?.data || [];
  const incomeBreakdown = incomeData?.data || [];

  const expenseChart = expenseBreakdown.map((b: any) => ({
    name: b.module || b.category || "—",
    total: Number(b.total),
  }));
  const incomeChart = incomeBreakdown.map((b: any) => ({
    name: b.particular || "—",
    total: Number(b.total),
  }));

  const fmt = (v: any) =>
    v === undefined || v === null
      ? "0.00"
      : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm font-medium">From</label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">To</label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <Button
          onClick={() => {
            setAppliedStart(start || undefined);
            setAppliedEnd(end || undefined);
          }}
        >
          Apply
        </Button>
        {(appliedStart || appliedEnd) && (
          <Button
            variant="ghost"
            onClick={() => {
              setStart("");
              setEnd("");
              setAppliedStart(undefined);
              setAppliedEnd(undefined);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total Income"
              value={fmt(pl?.income)}
              tone="bg-green-100 text-green-700"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatCard
              label="Total Expense"
              value={fmt(pl?.expense)}
              tone="bg-red-100 text-red-700"
              icon={<TrendingDown className="w-5 h-5" />}
            />
            <StatCard
              label="Net Profit / Loss"
              value={fmt(pl?.net)}
              tone="bg-blue-100 text-blue-700"
              icon={<Wallet className="w-5 h-5" />}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Income breakdown */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Income by Particular</h3>
              {incomeChart.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center">
                  No income in this period
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={incomeChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Expense breakdown */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Expense Breakdown</h3>
                <Select value={by} onValueChange={(v: any) => setBy(v)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="module">By Module</SelectItem>
                    <SelectItem value="category">By Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {expenseChart.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center">
                  No expense in this period
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={expenseChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default FinanceDashboard;
