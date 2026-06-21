"use client";
import { useState } from "react";
import useGetProfitLoss from "@/hooks/data/useGetProfitLoss";
import useGetExpenseBreakdown from "@/hooks/data/useGetExpenseBreakdown";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const { data: breakdownData } = useGetExpenseBreakdown(by);

  const pl = plData?.data;
  const breakdown = breakdownData?.data || [];
  const chartData = breakdown.map((b: any) => ({
    name: b.module || b.category,
    total: Number(b.total),
  }));

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
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Income"
            value={pl?.income ?? "0"}
            tone="bg-green-100 text-green-700"
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatCard
            label="Expense"
            value={pl?.expense ?? "0"}
            tone="bg-red-100 text-red-700"
            icon={<TrendingDown className="h-6 w-6" />}
          />
          <StatCard
            label="Net"
            value={pl?.net ?? "0"}
            tone="bg-blue-100 text-blue-700"
            icon={<Wallet className="h-6 w-6" />}
          />
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Expense Breakdown</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={by === "module" ? "default" : "outline"}
              onClick={() => setBy("module")}
            >
              By Module
            </Button>
            <Button
              size="sm"
              variant={by === "category" ? "default" : "outline"}
              onClick={() => setBy("category")}
            >
              By Category
            </Button>
          </div>
        </div>
        {chartData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No expense data.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}

export default FinanceDashboard;
