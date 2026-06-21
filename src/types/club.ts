// ============================================================
// Shared types for the club-management frontend (added incrementally)
// ============================================================

export interface ApiEnvelope<T = any> {
  code: number;
  status: "success" | "failed";
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ---------- Attendance ----------
export interface StaffProfile {
  id: number;
  user: number;
  username?: string;
  staff_ID: string;
  designation: string;
  phone: string;
  guest_allowed: boolean;
  is_active: boolean;
}

export interface RFIDCard {
  id: number;
  card_uid: string;
  card_type: "member" | "staff" | "guest_temporary";
  is_assigned: boolean;
  member: number | null;
  staff: number | null;
  is_active: boolean;
}

export interface Guest {
  id: number;
  name: string;
  phone: string;
  guest_relation: "guest" | "family";
  host_type: "member" | "staff";
  host_member: number | null;
  host_staff: number | null;
  temporary_card: number | null;
  is_active: boolean;
}

export interface AttendanceRecord {
  id: number;
  subject_type: "member" | "staff" | "guest";
  member: number | null;
  staff: number | null;
  guest: number | null;
  card: number | null;
  check_in: string;
  check_out: string | null;
  is_active: boolean;
}

// ---------- Restaurant ordering ----------
export interface SpicyLevel {
  id: number;
  name: string;
  rank: number;
  is_active: boolean;
}

export interface RestaurantOrderItem {
  id: number;
  item: number;
  item_name: string;
  quantity: number;
  unit_price: string;
  spicy_level: number | null;
  spicy_level_name: string | null;
  note: string;
}

export interface RestaurantOrder {
  id: number;
  order_number: string;
  status:
    | "pending_otp"
    | "confirmed"
    | "preparing"
    | "ready"
    | "served"
    | "billed"
    | "cancelled";
  serve_location: "restaurant" | "room";
  room_number: string;
  placed_by: "member" | "waiter";
  sub_total: string;
  total_amount: string;
  note: string;
  otp_verified: boolean;
  restaurant: number;
  member: number;
  guest: number | null;
  waiter: number | null;
  invoice: number | null;
  items: RestaurantOrderItem[];
  created_at: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  unit: string;
  current_quantity: string;
  reorder_level: string;
  unit_cost: string;
  restaurant: number;
  is_low: boolean;
  is_active: boolean;
}

// ---------- Outlets (bar / tea lounge / cigar lounge) ----------
export type OutletType = "bar" | "tea_lounge" | "cigar_lounge";

export interface Outlet {
  id: number;
  name: string;
  outlet_type: OutletType;
  description: string;
  address: string;
  phone: string;
  capacity: number;
  status: "open" | "closed";
  opening_time: string | null;
  closing_time: string | null;
  admin: number | null;
  is_active: boolean;
}

export interface OutletItem {
  id: number;
  name: string;
  description: string;
  unit: string;
  unit_cost: string;
  selling_price: string;
  availability: boolean;
  spicy_selectable: boolean;
  is_public_show: boolean;
  category: number;
  outlet: number;
  media?: { id: number; image: string; item: number }[];
  is_active: boolean;
}

export interface CrossOrderingRule {
  id: number;
  source_type: string;
  target_type: string;
  allowed: boolean;
  requires_room_number: boolean;
  is_active: boolean;
}

export interface OutletOrderItem {
  id: number;
  outlet_item: number | null;
  restaurant_item: number | null;
  item_name: string;
  quantity: number;
  unit_price: string;
  spicy_level: number | null;
  spicy_level_name: string | null;
  note: string;
  source_type: string;
}

export interface OutletOrder {
  id: number;
  order_number: string;
  status:
    | "pending_otp"
    | "confirmed"
    | "preparing"
    | "ready"
    | "served"
    | "billed"
    | "cancelled";
  placed_by: "member" | "waiter";
  outlet: number;
  room_number: string;
  sub_total: string;
  total_amount: string;
  note: string;
  otp_verified: boolean;
  member: number;
  guest: number | null;
  waiter: number | null;
  invoice: number | null;
  items: OutletOrderItem[];
  created_at: string;
}

// ---------- Reservations ----------
export type ResourceType = "card_room" | "pool" | "badminton" | "paddle";

export interface ReservableResource {
  id: number;
  name: string;
  resource_type: ResourceType;
  description: string;
  advance_amount: string;
  capacity: number;
  max_per_member: number;
  slot_minutes: number;
  opening_time: string | null;
  closing_time: string | null;
  status: "open" | "closed" | "maintenance";
  is_active: boolean;
}

export interface Reservation {
  id: number;
  reservation_number: string;
  status: "pending_payment" | "confirmed" | "cancelled" | "completed";
  resource: number;
  resource_name: string;
  resource_type: ResourceType;
  member: number;
  start_time: string;
  end_time: string;
  party_size: number;
  advance_amount: string;
  advance_paid: boolean;
  note: string;
  invoice: number | null;
  created_at: string;
}

export interface AvailabilityResult {
  resource_id: number;
  capacity: number;
  used: number;
  available: number;
  is_available: boolean;
}

// ---------- Payroll ----------
export interface SalaryComponent {
  id: number;
  name: string;
  component_type: "earning" | "deduction";
  calc_type: "fixed" | "percent_of_basic";
  is_taxable: boolean;
  is_active: boolean;
}

export interface PayslipLine {
  id: number;
  component_name: string;
  component_type: string;
  amount: string;
}

export interface Payslip {
  id: number;
  run: number;
  staff: number;
  staff_ID: string;
  basic_salary: string;
  gross_earnings: string;
  total_deductions: string;
  net_pay: string;
  status: "generated" | "paid" | "cancelled";
  paid_at: string | null;
  note: string;
  lines: PayslipLine[];
}

export interface PayrollRun {
  id: number;
  name: string;
  period_year: number;
  period_month: number;
  status: "draft" | "processed" | "paid" | "cancelled";
  total_amount: string;
  processed_by: number | null;
  payslips: Payslip[];
  created_at: string;
}

export interface StaffLoan {
  id: number;
  staff: number;
  principal: string;
  monthly_deduction: string;
  outstanding: string;
  status: "active" | "closed";
  note: string;
  is_active: boolean;
}

// ---------- Vendor ----------
export interface Vendor {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  is_active: boolean;
}

export interface VendorServiceOffer {
  id: number;
  vendor: number;
  vendor_name: string;
  category: number;
  category_name: string;
  title: string;
  description: string;
  price: string;
  billing_cycle: "one_time" | "monthly" | "yearly";
  status: "offered" | "selected" | "rejected";
  is_active: boolean;
}

// ---------- Finance ----------
export interface ProfitLoss {
  income: string;
  expense: string;
  net: string;
  start: string | null;
  end: string | null;
}

export interface Expense {
  id: number;
  source_module: string;
  category: number;
  category_name: string;
  amount: string;
  description: string;
  incurred_on: string;
  reference_type: string;
  reference_id: number | null;
  created_by: number | null;
}

// ---------- Event costs ----------
export interface EventExpense {
  id: number;
  event: number;
  category: number | null;
  kind: string;
  title: string;
  description: string;
  quantity: string;
  unit_cost: string;
  amount: string;
  is_active: boolean;
}

export interface EventProfitability {
  event_id: number;
  title: string;
  ticket_income: string;
  total_expense: string;
  net: string;
}
