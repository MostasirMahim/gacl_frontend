"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LucideIcon,
  Diamond,
  Home,
  CheckSquare,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Activity,
  Mail,
  FileText,
  User,
  Users,
  ArrowUpRight,
} from "lucide-react";
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
} from "recharts";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DashboardSummary, LiveData } from "../hooks/useDashboard";
import { ClubIllustration } from "../ui/ClubIllustration";
import { AnimatedNumber, HexIcon } from "../ui/DashAtoms";

interface OverviewSectionPanelProps {
  data: DashboardSummary["data"];
  live?: LiveData | null;
}

// ─── Bottom-Right Card Sparkline SVGs Matching 1st Mockup ──────────────────
function CardWavePurple() {
  return (
    <svg width="74" height="32" viewBox="0 0 74 32" fill="none" className="shrink-0">
      <defs>
        <linearGradient id="purpleWaveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 24C14 24 22 28 32 20C42 12 50 4 72 2"
        stroke="hsl(var(--primary))"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M2 24C14 24 22 28 32 20C42 12 50 4 72 2V32H2V24Z"
        fill="url(#purpleWaveGrad)"
      />
    </svg>
  );
}

function CardWaveBlue() {
  return (
    <svg width="74" height="32" viewBox="0 0 74 32" fill="none" className="shrink-0">
      <defs>
        <linearGradient id="blueWaveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 26C16 26 24 16 38 18C52 20 58 6 72 4"
        stroke="#38bdf8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M2 26C16 26 24 16 38 18C52 20 58 6 72 4V32H2V26Z"
        fill="url(#blueWaveGrad)"
      />
    </svg>
  );
}

function CardWaveEmerald() {
  return (
    <svg width="74" height="32" viewBox="0 0 74 32" fill="none" className="shrink-0">
      <defs>
        <linearGradient id="emeraldWaveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 22C12 22 20 28 34 22C48 16 54 8 72 6"
        stroke="#10b981"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M2 22C12 22 20 28 34 22C48 16 54 8 72 6V32H2V22Z"
        fill="url(#emeraldWaveGrad)"
      />
    </svg>
  );
}

function CardMiniBars() {
  return (
    <div className="flex items-end gap-1.5 h-7 shrink-0 pr-1">
      <span className="w-1.5 h-2 rounded-full bg-primary/35" />
      <span className="w-1.5 h-3 rounded-full bg-primary/45" />
      <span className="w-1.5 h-4.5 rounded-full bg-primary/60" />
      <span className="w-1.5 h-3.5 rounded-full bg-primary/75" />
      <span className="w-1.5 h-5.5 rounded-full bg-primary/90" />
      <span className="w-1.5 h-7 rounded-full bg-primary shadow-xs" />
    </div>
  );
}

// ─── Top Mockup KPI Card Navigation Resolver ──────────────────────────────
interface CardAction {
  label: string;
  href: string;
}

function getCardActions(title: string, customActions?: CardAction[]): CardAction[] {
  if (customActions && customActions.length > 0) {
    return customActions;
  }

  const t = title.toLowerCase();

  // MemberSphere / Members
  if (t.includes("member")) {
    return [
      { label: "View All Members", href: "/members/view" },
      { label: "Pending Approvals", href: "/members/pending" },
      { label: "Add New Member", href: "/members/add" },
      { label: "Transfer History", href: "/members/history" },
    ];
  }

  // Sales / Revenue / Finance
  if (t.includes("sales") || t.includes("revenue")) {
    return [
      { label: "View All Sales", href: "/mfm/sales" },
      { label: "Finance & Accounts", href: "/finance" },
      { label: "View All Invoices", href: "/mfm/invoices" },
      { label: "Transactions Ledger", href: "/mfm/transections" },
    ];
  }

  // Dining / Kitchen / Restaurant Orders
  if (t.includes("dining") || t.includes("kitchen") || (t.includes("order") && !t.includes("outlet"))) {
    return [
      { label: "Kitchen & Live Orders", href: "/restaurant-orders" },
      { label: "Restaurants Overview", href: "/restaurants" },
      { label: "Upload Sales", href: "/restaurants/sales/upload" },
      { label: "Menu Choices", href: "/restaurants/choices" },
    ];
  }

  // Footfall / Attendance / Gate / Inside
  if (t.includes("footfall") || t.includes("inside") || t.includes("scan") || t.includes("attendance")) {
    return [
      { label: "Attendance Dashboard", href: "/attendance" },
      { label: "System Activity Logs", href: "/activity_logs" },
      { label: "My Activity Logs", href: "/my-activity-logs" },
    ];
  }

  // Invoices / Payment
  if (t.includes("invoice") || t.includes("payment")) {
    return [
      { label: "View Invoices", href: "/mfm/invoices" },
      { label: "Payment Invoice", href: "/mfm/payment_invoice" },
      { label: "Payment Options", href: "/mfm/payment_options" },
    ];
  }

  // Dues / Member Accounts
  if (t.includes("due") || t.includes("account")) {
    return [
      { label: "View Member Dues", href: "/mfm/view_member_dues" },
      { label: "View Member Accounts", href: "/mfm/view_member_accounts" },
      { label: "Record Payment", href: "/mfm/payments" },
    ];
  }

  // Outlet / Lounge / Bar
  if (t.includes("outlet") || t.includes("tab") || t.includes("beverage")) {
    return [
      { label: "Outlets Management", href: "/outlets" },
      { label: "Upload Lounge Sales", href: "/upload/sales/lounge" },
      { label: "Upload Other Sales", href: "/upload/sales/others" },
    ];
  }

  // Facilities / Bookings / Reservations
  if (t.includes("facility") || t.includes("booking") || t.includes("reservation")) {
    return [
      { label: "View Reservations", href: "/reservations" },
      { label: "View Facilities", href: "/facilities" },
      { label: "Create Facility", href: "/facilities/create" },
    ];
  }

  // Events / Tickets
  if (t.includes("event") || t.includes("ticket")) {
    return [
      { label: "All Events", href: "/events" },
      { label: "Event Tickets", href: "/events/tickets" },
      { label: "Event Venues", href: "/events/venues" },
    ];
  }

  // Promo Codes
  if (t.includes("promo")) {
    return [
      { label: "All Promo Codes", href: "/promo_codes" },
      { label: "Add Promo Code", href: "/promo_codes/add" },
      { label: "Applied Promo Codes", href: "/promo_codes/applied_promo_codes" },
    ];
  }

  // Staff / Payroll / HR
  if (t.includes("staff") || t.includes("payroll") || t.includes("payslip") || t.includes("loan")) {
    return [
      { label: "Payroll Management", href: "/payroll" },
      { label: "Staff Attendance", href: "/attendance" },
      { label: "System Users", href: "/users" },
    ];
  }

  // Vendors / Procurement
  if (t.includes("vendor") || t.includes("contract") || t.includes("procurement") || t.includes("offer")) {
    return [
      { label: "Vendor Management", href: "/vendors" },
      { label: "Products Catalog", href: "/products" },
      { label: "Finance Ledger", href: "/finance" },
    ];
  }

  // Products
  if (t.includes("product")) {
    return [
      { label: "View Products", href: "/products" },
      { label: "Add Product", href: "/products/add" },
      { label: "Categories", href: "/products/categories" },
    ];
  }

  // KYC / Onboarding
  if (t.includes("kyc") || t.includes("onboard")) {
    return [
      { label: "Pending Approvals", href: "/members/pending" },
      { label: "Member Onboarding", href: "/registration/email" },
      { label: "View Members", href: "/members/view" },
    ];
  }

  return [
    { label: "Member Directory", href: "/members/view" },
    { label: "Finance & Accounts", href: "/finance" },
    { label: "System Activity", href: "/activity_logs" },
  ];
}

// ─── Top Mockup KPI Card ───────────────────────────────────────────────────
function MockupKpiCard({
  icon: Icon,
  title,
  value,
  trend,
  trendLabel = "to prev month",
  delay = 0,
  index = 0,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  value: number;
  trend: number;
  trendLabel?: string;
  delay?: number;
  index?: number;
  actions?: CardAction[];
}) {
  const isCurrency =
    title.toLowerCase().includes("sales") ||
    title.toLowerCase().includes("revenue") ||
    title.toLowerCase().includes("dues") ||
    title.toLowerCase().includes("spend") ||
    title.toLowerCase().includes("payroll") ||
    title.toLowerCase().includes("cost");

  const cardActions = getCardActions(title, actions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="relative bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Top-left glowing cyan/primary accent bar matching mockup */}
      <div className="absolute top-3 left-0 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_12px_hsl(var(--primary))]" />

      {/* Subtle radial glow in the corner */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

      {/* Card Header: Icon on Left, Three-dot action on Right */}
      <div className="flex items-start justify-between mb-3">
        <HexIcon size={46}>
          <Icon size={20} className="text-primary" />
        </HexIcon>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More options"
              className="text-muted-foreground/35 hover:text-foreground hover:bg-muted/50 p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
            >
              <MoreHorizontal size={15} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="w-52 p-1.5 bg-popover/95 backdrop-blur-md shadow-xl border border-border/80 rounded-xl z-50 animate-in fade-in-0 zoom-in-95"
          >
            <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-semibold text-foreground tracking-tight">
              {title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-border/50" />
            <div className="space-y-0.5">
              {cardActions.map((action, idx) => (
                <DropdownMenuItem
                  key={idx}
                  asChild
                  className="p-0 focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer"
                >
                  <Link
                    href={action.href}
                    className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors group/item"
                  >
                    <span className="truncate">{action.label}</span>
                    <ArrowUpRight
                      size={13}
                      className="text-muted-foreground/60 group-hover/item:text-primary transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 shrink-0 ml-1.5"
                    />
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card Body: Left metrics & Right bottom sparkline visual matching 1st image */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-3xl font-extrabold text-foreground tracking-tight leading-none mb-2">
              <AnimatedNumber value={value} prefix={isCurrency ? "$" : ""} />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
              <TrendingUp size={13} className="text-emerald-500 shrink-0" />
              <span>+{Math.abs(trend)}%</span>
              <span className="text-muted-foreground/80 font-normal">{trendLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Custom Area Chart Tooltip ─────────────────────────────────────────────
const GrowthTooltip = ({ active, payload, label, seriesName = "Member" }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const isCurrency =
    seriesName.toLowerCase().includes("$") ||
    seriesName.toLowerCase().includes("revenue") ||
    seriesName.toLowerCase().includes("sales") ||
    seriesName.toLowerCase().includes("spend");
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border px-3 py-2 rounded-xl shadow-2xl text-xs space-y-1">
      <p className="font-semibold text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
        <span className="text-foreground font-bold">
          {seriesName}: {isCurrency ? `$${Number(val).toLocaleString()}` : typeof val === "number" ? val.toLocaleString() : val}
        </span>
      </div>
    </div>
  );
};

// ─── Custom Bar Chart Tooltip ──────────────────────────────────────────────
const OrdersTooltip = ({ active, payload, label, unitLabel = "Orders" }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const isCurrency =
    unitLabel.toLowerCase().includes("$") ||
    unitLabel.toLowerCase().includes("sales") ||
    unitLabel.toLowerCase().includes("spend");
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border px-3 py-2 rounded-xl shadow-2xl text-xs space-y-1">
      <p className="font-semibold text-muted-foreground">Hour: {label}:00</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
        <span className="text-foreground font-bold">
          {unitLabel}: {isCurrency ? `$${Number(val).toLocaleString()}` : typeof val === "number" ? val.toLocaleString() : val}
        </span>
      </div>
    </div>
  );
};

// ─── Attendance / Capacity Circular Progress Meter ─────────────────────────
function AttendanceMeter({
  value,
  label = "Attendance",
  percentage,
}: {
  value: number;
  label?: string;
  percentage?: number;
}) {
  const size = 136;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // An aesthetic 76% gauge arc like the mockup
  const arcLength = circumference * 0.76;
  const fillFactor = percentage != null ? Math.min(Math.max(percentage, 5), 100) / 100 : 0.85;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background track arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeOpacity={0.16}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          fill="transparent"
        />
        {/* Outer decorative ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 6}
          stroke="hsl(var(--primary))"
          strokeOpacity={0.1}
          strokeWidth={1.2}
          fill="transparent"
        />
        {/* Active glowing meter arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength * fillFactor} ${circumference}`}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))",
          }}
        />
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <span className="text-2xl font-black text-foreground tracking-tight leading-none">
          <AnimatedNumber value={value} />
        </span>
        <span className="text-[11px] font-medium text-muted-foreground mt-1">{label}</span>
      </div>
    </div>
  );
}

const ICON_MAP: Record<string, LucideIcon> = {
  Diamond,
  Users,
  Home,
  CheckSquare,
  TrendingUp,
  FileText,
  Activity,
  Mail,
  User,
};

// ─── Main Overview Component ───────────────────────────────────────────────
export function OverviewSectionPanel({ data, live }: OverviewSectionPanelProps) {
  const {
    overview,
    member,
    restaurant,
    attendance,
    reservations,
    system,
    finance,
    outlet,
  } = data;

  // 1. TOP ROW KPIS (From real backend overview or fallback)
  const kpiCards: Array<{
    icon: LucideIcon;
    title: string;
    value: number;
    trend: number;
    trendLabel: string;
    actions?: CardAction[];
  }> = useMemo(() => {
    if (overview?.kpi_cards?.length === 4) {
      return overview.kpi_cards.map((c) => ({
        icon: ICON_MAP[c.icon] || Diamond,
        title: c.title,
        value: c.value,
        trend: c.trend,
        trendLabel: c.trendLabel,
        actions: c.actions,
      }));
    }
    return [
      {
        icon: Diamond,
        title: "Total Members",
        value: member?.kpi.total_members ?? 50,
        trend: 2.2,
        trendLabel: "to prev month",
        actions: [
          { label: "View All Members", href: "/members/view" },
          { label: "Pending Approvals", href: "/members/pending" },
          { label: "Add New Member", href: "/members/add" },
          { label: "Transfer History", href: "/members/history" },
        ],
      },
      {
        icon: Users,
        title: "Active Members",
        value: member?.kpi.active_members ?? 50,
        trend: 5.9,
        trendLabel: "to prev month",
        actions: [
          { label: "View All Members", href: "/members/view" },
          { label: "Transfer History", href: "/members/history" },
        ],
      },
      {
        icon: Home,
        title: "Open Facilities",
        value: reservations?.resource_status.length ?? outlet?.kpi.total_outlets ?? 8,
        trend: 8.5,
        trendLabel: "operational",
        actions: [
          { label: "View Reservations", href: "/reservations" },
          { label: "View Facilities", href: "/facilities" },
          { label: "Create Facility", href: "/facilities/create" },
        ],
      },
      {
        icon: CheckSquare,
        title: "Inside Footfall",
        value: live?.attendance?.currently_inside ?? attendance?.kpi.total_checkins_today ?? 142,
        trend: 7.5,
        trendLabel: "active today",
        actions: [
          { label: "Attendance Dashboard", href: "/attendance" },
          { label: "System Activity Logs", href: "/activity_logs" },
          { label: "My Activity Logs", href: "/my-activity-logs" },
        ],
      },
    ];
  }, [overview?.kpi_cards, member, reservations, outlet, live, attendance]);

  // 2. SPLINE AREA CHART (12 Data Points)
  const splineTitle = overview?.spline_chart?.title ?? "Member growth";
  const splineSeriesName = overview?.spline_chart?.series_name ?? "Member";
  const growthChartData = useMemo(() => {
    if (overview?.spline_chart?.data?.length) {
      return overview.spline_chart.data.map((d) => ({
        month: d.label,
        members: d.value,
      }));
    }
    const raw = member?.growth_chart ?? [];
    if (raw.length >= 6) {
      return raw.map((r) => ({
        month: r.month.split(" ")[0],
        members: r.new_members,
      }));
    }
    return [
      { month: "Jan", members: 160 },
      { month: "Feb", members: 310 },
      { month: "Mar", members: 340 },
      { month: "Apr", members: 580 },
      { month: "May", members: 510 },
      { month: "Jun", military: 590, members: 590 },
      { month: "Jul", members: 680 },
      { month: "Aug", members: 820 },
      { month: "Sep", members: 890 },
      { month: "Oct", members: 940 },
      { month: "Nov", members: 990 },
      { month: "Dec", members: 1190 },
    ];
  }, [overview?.spline_chart, member?.growth_chart]);

  // 3. MEMBERSHIP / CATEGORY DONUT CHART
  const donutTitle = overview?.donut_chart?.title ?? "Membership Type";
  const membershipDonutData = useMemo(() => {
    if (overview?.donut_chart?.data?.length) {
      return overview.donut_chart.data;
    }
    const raw = member?.type_breakdown ?? [];
    if (raw.length > 0) {
      return raw.map((r, i) => ({
        name: r.membership_type || `Type ${i + 1}`,
        value: r.total,
      }));
    }
    return [
      { name: "Primary", value: 450 },
      { name: "Memberships", value: 310 },
      { name: "Pending", value: 180 },
      { name: "Others", value: 120 },
    ];
  }, [overview?.donut_chart, member?.type_breakdown]);

  const DONUT_OPACITIES = [1, 0.72, 0.46, 0.25, 0.15];

  // 4. ITEM LIST (Birthdays / Top items / VIP members)
  const itemListTitle = overview?.item_list?.title ?? "Upcoming Birthdays";
  const birthdaysList = useMemo(() => {
    if (overview?.item_list?.items?.length) {
      return overview.item_list.items.map((it) => ({
        id: it.id,
        name: it.name,
        role: it.subtitle,
        date: it.tag,
        initials: it.initials,
      }));
    }
    const raw = member?.upcoming_birthdays ?? [];
    const baseList: { id: number | string; name: string; role: string; date: string; initials: string }[] = [];
    raw.forEach((b) => {
      const d = b.date_of_birth ? new Date(b.date_of_birth) : new Date();
      const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const initials = `${b.first_name?.[0] || ""}${b.last_name?.[0] || ""}`.toUpperCase() || "MB";
      baseList.push({
        id: b.id,
        name: `${b.first_name} ${b.last_name}`.trim(),
        role: "Member",
        date: formattedDate,
        initials,
      });
    });
    return baseList.slice(0, 4);
  }, [overview?.item_list, member?.upcoming_birthdays]);

  // 5. ACTION TABLE (Pending Approvals / Orders / Invoices)
  const actionTableTitle = overview?.action_table?.title ?? "Pending Approvals";
  const actionButtonLabel = overview?.action_table?.action_button_label ?? "Review";
  const actionTableHeaders = overview?.action_table?.headers ?? ["Applicant", "Type", "Applied Date"];
  const actionViewAllLink = overview?.action_table?.rows?.[0]?.link_url ?? "/members/pending";
  const pendingApprovalsList = useMemo(() => {
    if (overview?.action_table?.rows?.length) {
      return overview.action_table.rows.map((r) => ({
        id: r.id,
        name: r.col1,
        type: r.col2,
        date: r.col3,
        link_url: r.link_url ?? "/members/pending",
      }));
    }
    const raw = member?.pending_approval_queue ?? [];
    if (raw.length > 0) {
      return raw.slice(0, 4).map((item) => ({
        id: item.id,
        name: `${item.first_name} ${item.last_name}`.trim() || item.member_ID,
        type: item.membership_type__name || "Primary",
        date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Today",
        link_url: "/members/pending",
      }));
    }
    return [
      { id: 101, name: "Mantian Name", type: "Primary", date: "12/01/2026", link_url: "/members/pending" },
      { id: 102, name: "Maatian Name", type: "Primary", date: "10/01/2026", link_url: "/members/pending" },
      { id: 103, name: "Mantian Name", type: "Primary", date: "10/01/2026", link_url: "/members/pending" },
      { id: 104, name: "Mantian Name", type: "Primary", date: "12/01/2026", link_url: "/members/pending" },
    ];
  }, [overview?.action_table, member?.pending_approval_queue]);

  // 6. HOURLY BAR CHART
  const hourlyChartTitle = overview?.hourly_bar_chart?.title ?? "Orders today by hour";
  const hourlyUnitLabel = overview?.hourly_bar_chart?.unit_label ?? "Orders";
  const hourlyOrdersData = useMemo(() => {
    if (overview?.hourly_bar_chart?.data?.length) {
      return overview.hourly_bar_chart.data.map((d) => ({
        hour: d.hour,
        orders: d.value,
      }));
    }
    const raw = restaurant?.hourly_chart ?? attendance?.hourly_chart ?? [];
    const hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const baseDistribution = [85, 140, 70, 135, 150, 100, 190, 160, 185, 195, 130, 45];
    const chart = hours.map((h, i) => ({
      hour: h,
      orders: baseDistribution[i],
    }));
    if (raw.length > 0) {
      raw.forEach((item) => {
        const hr = item.hour.split(":")[0];
        const matchIdx = hours.findIndex((h) => h === hr || parseInt(h, 10) === parseInt(hr, 10));
        if (matchIdx !== -1) {
          chart[matchIdx].orders = (item as any).orders ?? (item as any).checkins ?? 200;
        }
      });
    }
    return chart;
  }, [overview?.hourly_bar_chart, restaurant?.hourly_chart, attendance?.hourly_chart]);

  // 7. CURRENTLY INSIDE ATTENDANCE / CAPACITY
  const radialTitle = overview?.radial_gauge?.title ?? "Attendance currently-inside";
  const radialLabel = overview?.radial_gauge?.center_label ?? "Attendance";
  const radialPercentage = overview?.radial_gauge?.percentage;
  const radialSubtext = overview?.radial_gauge?.subtext;
  const currentlyInsideValue =
    overview?.radial_gauge?.value ||
    live?.attendance?.currently_inside ||
    attendance?.kpi.currently_inside ||
    attendance?.kpi.total_checkins_today ||
    142;

  // 8. RECENT ACTIVITY LOG
  const activityTitle = overview?.activity_feed?.title ?? "Recent activity log";
  const activityLogs = useMemo(() => {
    if (overview?.activity_feed?.items?.length) {
      return overview.activity_feed.items.map((it) => ({
        id: it.id,
        action: it.title,
        message: it.subtitle,
        time: it.time_ago,
        icon: ICON_MAP[it.icon] || Activity,
      }));
    }
    const rawAudit = system?.recent_audit_log ?? [];
    if (rawAudit.length > 0) {
      return rawAudit.slice(0, 3).map((a, i) => ({
        id: i,
        action: a.user,
        message: `${a.verb} ${a.path}`,
        time: a.timestamp ? "Just now" : "15:19 ago",
        icon: i % 3 === 0 ? Activity : i % 3 === 1 ? Mail : FileText,
      }));
    }
    return [
      { id: 1, action: "Member check-in", message: "RFID access verified", time: "12m ago", icon: Activity },
      { id: 2, action: "Dining order #250", message: "Status: Billed - $1990", time: "24m ago", icon: Mail },
      { id: 3, action: "Invoice #420 issued", message: "Status: Paid", time: "45m ago", icon: FileText },
    ];
  }, [overview?.activity_feed, system?.recent_audit_log]);

  // 9. FACILITY / SERVICE STATUS LIST
  const statusTitle = overview?.status_table?.title ?? "Facility status";
  const statusHeaders = overview?.status_table?.headers ?? ["Facility", "Type", "Status"];
  const facilityStatuses = useMemo(() => {
    if (overview?.status_table?.rows?.length) {
      return overview.status_table.rows.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        status: r.status,
      }));
    }
    const raw = reservations?.resource_status ?? [];
    if (raw.length > 0) {
      return raw.slice(0, 3).map((res) => ({
        id: res.id,
        name: res.name,
        type: res.resource_type.replace(/_/g, " "),
        status: res.status,
      }));
    }
    return [
      { id: 1, name: "Card Room 1", type: "Sports", status: "open" },
      { id: 2, name: "Pool Table A", type: "Recreation", status: "open" },
      { id: 3, name: "Swimming Pool", type: "Aquatics", status: "open" },
    ];
  }, [overview?.status_table, reservations?.resource_status]);

  return (
    <div className="space-y-4">
      {/* ────────────────── TOP ROW: 4 KPI CARDS ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <MockupKpiCard
            key={i}
            icon={card.icon}
            title={card.title}
            value={card.value}
            trend={card.trend}
            trendLabel={card.trendLabel}
            actions={card.actions}
            delay={i * 0.06}
            index={i}
          />
        ))}
      </div>

      {/* ────────────────── SECOND ROW: 3 COLUMNS ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Member Growth Area Spline Chart (~50%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="lg:col-span-6 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full min-h-[290px]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {splineTitle}
            </h2>
          </div>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="mockupGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.4}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, "auto"]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<GrowthTooltip seriesName={splineSeriesName} />} />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#mockupGrowthGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--card))",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Panel 2: Membership / Category Donut Chart (~25%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="lg:col-span-3 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full min-h-[290px]"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {donutTitle}
            </h2>
          </div>
          <div className="w-full h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={membershipDonutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {membershipDonutData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={`hsla(var(--primary) / ${DONUT_OPACITIES[i % DONUT_OPACITIES.length]})`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0];
                    return (
                      <div className="bg-card border border-border px-2.5 py-1.5 rounded-lg text-xs shadow-md">
                        <span className="font-semibold text-foreground">{p.name}: </span>
                        <span className="text-primary font-bold">{p.value}</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend dots */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 pt-2 text-[11px] text-muted-foreground">
            {membershipDonutData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: `hsla(var(--primary) / ${DONUT_OPACITIES[i % DONUT_OPACITIES.length]})`,
                  }}
                />
                <span className="capitalize">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Panel 3: 4-Item List (~25%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="lg:col-span-3 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full min-h-[290px]"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {itemListTitle}
            </h2>
          </div>
          <div className="flex-1 flex flex-col justify-between py-1 gap-2.5">
            {birthdaysList.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 text-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {b.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate leading-tight">
                      {b.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{b.role}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
                  {b.date}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ────────────────── THIRD ROW: 3 COLUMNS ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Pending Approvals / Action Table (~38%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="lg:col-span-5 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full min-h-[270px]"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {actionTableTitle}
            </h2>
            <Link
              href={actionViewAllLink}
              className="text-xs text-primary hover:underline flex items-center gap-0.5 font-medium"
            >
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-muted-foreground/80 border-b border-border/50">
                  <th className="pb-2 font-medium">{actionTableHeaders[0]}</th>
                  <th className="pb-2 font-medium">{actionTableHeaders[1]}</th>
                  <th className="pb-2 font-medium">{actionTableHeaders[2]}</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {pendingApprovalsList.map((row) => (
                  <tr key={row.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-semibold text-foreground truncate max-w-[120px]">
                      {row.name}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{row.type}</td>
                    <td className="py-2.5 text-muted-foreground tabular-nums">{row.date}</td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={row.link_url || "/members/pending"}
                        className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {actionButtonLabel}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Panel 2: Hourly Bar Chart (~32%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="lg:col-span-4 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full min-h-[270px]"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {hourlyChartTitle}
            </h2>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyOrdersData} margin={{ top: 10, right: 4, bottom: 0, left: -24 }}>
                <defs>
                  <linearGradient id="mockupBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.4}
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, "auto"]}
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<OrdersTooltip unitLabel={hourlyUnitLabel} />} />
                <Bar
                  dataKey="orders"
                  fill="url(#mockupBarGradient)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Panel 3: Attendance Currently-Inside Meter + Building Watermark (~30%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="relative lg:col-span-3 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full min-h-[270px] group"
        >
          {/* Card Title */}
          <div className="flex items-center justify-between mb-2 relative z-10">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {radialTitle}
            </h2>
          </div>

          {/* Radial Graph Centered in XY */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-1">
            <AttendanceMeter
              value={currentlyInsideValue}
              label={radialLabel}
              percentage={radialPercentage}
            />
            {radialSubtext && (
              <p className="text-[11px] text-muted-foreground text-center font-medium mt-2 max-w-[210px] leading-tight">
                {radialSubtext}
              </p>
            )}
          </div>

          {/* Building Visual as Background Watermark in Bottom-Right Corner with Low Opacity */}
          <div className="absolute -bottom-1 -right-2 w-44 h-28 pointer-events-none select-none opacity-[0.14] dark:opacity-[0.20] transition-opacity duration-500 group-hover:opacity-[0.25]">
            <ClubIllustration className="w-full h-full text-primary" />
          </div>
        </motion.div>
      </div>

      {/* ────────────────── FOURTH ROW: 2 COLUMNS ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Recent activity log (50%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="lg:col-span-6 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {activityTitle}
            </h2>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="space-y-3.5 my-auto">
            {activityLogs.map((log) => {
              const Icon = log.icon;
              return (
                <div key={log.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                      <Icon size={14} />
                    </div>
                    <p className="text-foreground truncate">
                      <span className="font-semibold text-foreground">{log.action}</span>{" "}
                      <span className="text-muted-foreground">{log.message}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                    {log.time}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Panel 2: Facility / Service status (50%) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55 }}
          className="lg:col-span-6 bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">
              {statusTitle}
            </h2>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-muted-foreground/80 border-b border-border/50">
                  <th className="pb-2 font-medium">{statusHeaders[0]}</th>
                  <th className="pb-2 font-medium">{statusHeaders[1]}</th>
                  <th className="pb-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {facilityStatuses.map((fac) => {
                  const isOpen = fac.status === "open" || fac.status === "active";
                  const isMaintenance = fac.status === "maintenance";
                  return (
                    <tr key={fac.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-semibold text-foreground">{fac.name}</td>
                      <td className="py-2.5 text-muted-foreground capitalize">{fac.type}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                            isOpen
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : isMaintenance
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isOpen
                                ? "bg-emerald-400"
                                : isMaintenance
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                          {fac.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
