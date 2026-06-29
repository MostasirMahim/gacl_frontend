/**
 * Centralized registry of sub-permissions, route mappings, and component action IDs.
 */

export const sub_protected_routes: { path: string; permission_name: string }[] = [
  // Member sub-routes
  { path: "/members/add", permission_name: "member:create" },
  { path: "/members/view", permission_name: "member:view" },
  { path: "/members/pending", permission_name: "member:view" },

  // User & Group sub-routes
  { path: "/users", permission_name: "user:view_list" },
  { path: "/groups", permission_name: "group:view" },
  { path: "/registration", permission_name: "employee:onboard" },

  // Activity log sub-routes
  { path: "/activity_logs", permission_name: "activity_log:view" },

  // Email sub-routes
  { path: "/emails/compose", permission_name: "email:send_single" },
  { path: "/emails/outbox", permission_name: "email:view_logs" },

  // Restaurant sub-routes
  { path: "/restaurants/items/add", permission_name: "restaurant:menu_edit" },
  { path: "/restaurants/sales/upload", permission_name: "restaurant:menu_edit" },
  { path: "/restaurants/checkout", permission_name: "restaurant:order_create" },

  // Product sub-routes
  { path: "/products/add", permission_name: "product:create" },
  { path: "/products/categories/add", permission_name: "product:create" },
  { path: "/products/brands/add", permission_name: "product:create" },

  // Promo code sub-routes
  { path: "/promo_codes/add", permission_name: "promo_code:create" },

  // Financial sub-routes
  { path: "/mfm/invoices", permission_name: "member_financial:view_invoices" },
  { path: "/mfm/payment_invoice", permission_name: "member_financial:generate_invoice" },
  { path: "/mfm/income", permission_name: "member_financial:view_invoices" },
  { path: "/mfm/payments", permission_name: "member_financial:process_payment" },
  { path: "/mfm/view_member_dues", permission_name: "member_financial:adjust_dues" },
];

export const UI_ACTION_PERMISSIONS = {
  // Member Actions
  MEMBER_CREATE: "member:create",
  MEMBER_EDIT: "member:edit",
  MEMBER_DELETE: "member:delete",
  MEMBER_EXPORT: "member:export",

  // Financial Actions
  GENERATE_INVOICE: "member_financial:generate_invoice",
  PROCESS_PAYMENT: "member_financial:process_payment",
  ADJUST_DUES: "member_financial:adjust_dues",

  // Restaurant Actions
  MENU_EDIT: "restaurant:menu_edit",
  ORDER_CREATE: "restaurant:order_create",
  KITCHEN_UPDATE: "restaurant:kitchen_update",
  BILLING: "restaurant:billing",

  // Outlet Actions
  OUTLET_ORDER: "outlet:order_create",
  OUTLET_BILLING: "outlet:billing",

  // Activity Log Actions
  LOG_EXPORT: "activity_log:export",
  LOG_CLEAR: "activity_log:clear",
} as const;
