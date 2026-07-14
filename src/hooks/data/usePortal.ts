"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export function useMyDashboard() {
  return useQuery({
    queryKey: ["portalDashboard"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/member/v1/portal/dashboard/");
      return res?.data?.data;
    },
  });
}

export function useMyOrders(kind?: "restaurant" | "outlet") {
  return useQuery({
    queryKey: ["portalOrders", kind],
    queryFn: async () => {
      const q = kind ? `?kind=${kind}` : "";
      const res = await axiosInstance.get(`/api/member/v1/portal/orders/${q}`);
      return res?.data?.data || [];
    },
  });
}

export function useMyReservations() {
  return useQuery({
    queryKey: ["portalReservations"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/api/member/v1/portal/reservations/"
      );
      return res?.data?.data || [];
    },
  });
}

export function useMyInvoices(unpaidOnly = false) {
  return useQuery({
    queryKey: ["portalInvoices", unpaidOnly],
    queryFn: async () => {
      const q = unpaidOnly ? "?unpaid=true" : "";
      const res = await axiosInstance.get(`/api/member/v1/portal/invoices/${q}`);
      return res?.data?.data || [];
    },
  });
}

export function useRestaurants() {
  return useQuery({
    queryKey: ["portalRestaurants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/restaurants/v1/restaurants/");
      return res?.data?.results || res?.data?.data || res?.data || [];
    },
  });
}
