"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";

export interface DashboardSummary {
  sections: string[];
  data: {
    member?: MemberSection;
    finance?: FinanceSection;
    restaurant?: RestaurantSection;
    outlet?: OutletSection;
    reservations?: ReservationsSection;
    events?: EventsSection;
    attendance?: AttendanceSection;
    payroll?: PayrollSection;
    vendor?: VendorSection;
    system?: SystemSection;
  };
}

export interface MemberSection {
  kpi: {
    total_members: number;
    active_members: number;
    pending_status_members: number;
    pending_approval_members: number;
    inactive_members: number;
    new_this_month: number;
  };
  growth_chart: { month: string; new_members: number }[];
  type_breakdown: { membership_type: string; active: number; pending: number; total: number }[];
  pending_approval_queue: {
    id: number;
    first_name: string;
    last_name: string;
    member_ID: string;
    created_at: string;
    "membership_type__name": string;
  }[];
  upcoming_birthdays: {
    id: number;
    first_name: string;
    last_name: string;
    member_ID: string;
    date_of_birth: string;
  }[];
}

export interface FinanceSection {
  kpi: {
    revenue_mtd: number;
    sales_mtd: number;
    total_outstanding_dues: number;
    total_invoices: number;
    unpaid_invoices: number;
    paid_invoices: number;
  };
  invoice_status_chart: { status: string; count: number }[];
  top_debtors: { member__first_name: string; member__last_name: string; member__member_ID: string; overdue_amount: number }[];
}

export interface RestaurantSection {
  kpi: {
    orders_today: number;
    in_progress: number;
    billed_today: number;
    cancelled_today: number;
    served_today: number;
    revenue_today: number;
  };
  status_chart: { status: string; count: number }[];
  hourly_chart: { hour: string; orders: number }[];
  restaurant_revenue: { restaurant: string; revenue: number }[];
  top_items_today: { item: string; times_ordered: number }[];
}

export interface OutletSection {
  kpi: {
    total_outlets: number;
    open_outlets: number;
    orders_today: number;
    active_orders_now: number;
    revenue_today: number;
  };
  per_outlet_today: { outlet: string; type: string; orders: number; revenue: number }[];
}

export interface ReservationsSection {
  kpi: {
    total_today: number;
    confirmed_today: number;
    pending_payment: number;
    cancelled_today: number;
    active_now: number;
    upcoming_2h: number;
  };
  resource_status: {
    id: number;
    name: string;
    resource_type: string;
    status: string;
    capacity: number;
    opening_time: string | null;
    closing_time: string | null;
    bookings_today: number;
  }[];
  upcoming_reservations: {
    reservation_number: string;
    status: string;
    start_time: string;
    end_time: string;
    "resource__name": string;
    "member__first_name": string;
    "member__last_name": string;
    "member__member_ID": string;
    advance_paid: boolean;
  }[];
}

export interface EventsSection {
  kpi: {
    total_active_events: number;
    upcoming_events: number;
    events_this_month: number;
  };
  upcoming_events_list: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status: string;
    event_type: string;
    registration_deadline: string;
  }[];
  status_chart: { status: string; count: number }[];
}

export interface AttendanceSection {
  kpi: {
    currently_inside: number;
    members_inside: number;
    staff_inside: number;
    total_checkins_today: number;
    total_checkouts_today: number;
    guests_today: number;
  };
  hourly_chart: { hour: string; checkins: number }[];
  recent_feed: {
    subject_type: string;
    name: string;
    check_in: string;
    check_out: string | null;
    is_inside: boolean;
  }[];
}

export interface PayrollSection {
  kpi: {
    total_staff: number;
    current_month_payroll_status: string;
    current_month_payroll_total: number;
    pending_payslips: number;
    active_loans_count: number;
    total_loan_outstanding: number;
  };
}

export interface VendorSection {
  kpi: {
    total_vendors: number;
    active_contracts: number;
    pending_offers: number;
    total_service_categories: number;
    total_active_products: number;
  };
}

export interface SystemSection {
  kpi: {
    total_users: number;
    staff_users: number;
    member_users: number;
    total_groups: number;
    active_today: number;
  };
  recent_audit_log: {
    user: string;
    verb: string;
    path: string;
    severity: string;
    timestamp: string;
  }[];
}

export interface LiveData {
  restaurant_live_orders?: {
    order_number: string;
    status: string;
    restaurant: string;
    member_name: string;
    total_amount: number;
    created_at: string;
    serve_location: string;
  }[];
  attendance?: {
    currently_inside: number;
    recent_feed: {
      subject_type: string;
      name: string;
      check_in: string;
      check_out: string | null;
      is_inside: boolean;
    }[];
  };
}

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/api/dashboard/v1/summary/");
      setData(res.data);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useDashboardLive(
  enabled: boolean,
  intervalMs = 30_000
) {
  const [data, setData] = useState<LiveData | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetch = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await axiosInstance.get("/api/dashboard/v1/live/");
      setData(res.data.data);
    } catch {
      // silently ignore live errors
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    fetch();
    timerRef.current = setInterval(fetch, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, fetch, intervalMs]);

  return data;
}
