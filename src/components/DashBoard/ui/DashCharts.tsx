"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Shared tooltip style ──────────────────────────────────────────────────
const TooltipStyle: React.CSSProperties = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
  color: "hsl(var(--foreground))",
  padding: "8px 12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TooltipStyle}>
      <p className="font-semibold mb-1 text-xs text-muted-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-foreground font-medium">
            {typeof p.value === "number" && p.value > 999
              ? p.value.toLocaleString()
              : p.value}
          </span>
          <span className="text-muted-foreground">{p.name}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Area Chart: Member Growth ──────────────────────────────────────────────
export function MemberGrowthChart({
  data,
}: {
  data: { month: string; new_members: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="memberGrowthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="new_members"
          name="New Members"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#memberGrowthGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Donut Chart: Membership Type ───────────────────────────────────────────
const DONUT_OPACITIES = [1, 0.7, 0.45, 0.25];

export function MembershipDonutChart({
  data,
}: {
  data: { membership_type: string; total: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="membership_type"
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={`hsla(var(--primary) / ${DONUT_OPACITIES[i % DONUT_OPACITIES.length]})`}
            />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
          formatter={(value) =>
            value.length > 12 ? value.slice(0, 12) + "…" : value
          }
        />
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Bar Chart: Hourly Orders / Check-ins ──────────────────────────────────
export function HourlyBarChart({
  data,
  dataKey,
  name,
}: {
  data: { hour: string; [key: string]: any }[];
  dataKey: string;
  name: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey={dataKey}
          name={name}
          fill="url(#barGrad)"
          radius={[3, 3, 0, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Bar Chart: Restaurant Revenue per Restaurant ──────────────────────────
export function RestaurantRevenueBar({
  data,
}: {
  data: { restaurant: string; revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey="restaurant"
          type="category"
          width={80}
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="revenue"
          name="Revenue"
          fill="hsl(var(--primary))"
          fillOpacity={0.7}
          radius={[0, 3, 3, 0]}
          maxBarSize={12}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Mini donut: Order Status ──────────────────────────────────────────────
const STATUS_OPACITY_MAP: Record<string, number> = {
  billed: 1,
  served: 0.75,
  ready: 0.6,
  preparing: 0.45,
  confirmed: 0.3,
  cancelled: 0.15,
};

export function OrderStatusDonut({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  const filtered = data.filter((d) => d.count > 0);
  return (
    <ResponsiveContainer width="100%" height={120}>
      <PieChart>
        <Pie
          data={filtered}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius="50%"
          outerRadius="75%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {filtered.map((d, i) => (
            <Cell
              key={i}
              fill={`hsla(var(--primary) / ${STATUS_OPACITY_MAP[d.status] ?? 0.5})`}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
