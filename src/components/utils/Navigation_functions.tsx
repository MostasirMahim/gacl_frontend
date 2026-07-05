import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  Clock,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  ChevronRight,
  UserCheck,
  UserX,
  Plus,
  Eye,
  Edit,
  Logs,
  Mails,
  MailPlus,
  UserRound,
  BetweenHorizonalStart,
  SquarePen,
  ExternalLink,
  Settings,
  HandPlatter,
  Soup,
  BookCheck,
  ShoppingCart,
  ListTodo,
  Upload,
  PercentCircle,
  Code,
  TicketCheck,
  TicketPlus,
  CirclePlus,
  BadgeDollarSign,
  List,
  Package,
  Wallet,
  CircleDollarSign,
  WalletCards,
  FilePlus,
  CreditCard,
  ListChecks,
  HandCoins,
  FileChartColumn,
} from "lucide-react";

const navigation_sidebar_links = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "MemberSphere",
    href: "",
    subItems: [
      {
        icon: <UserCheck className="h-4 w-4" />,
        label: "Pending Members",
        href: "/members/pending",
      },
      {
        icon: <Plus className="h-4 w-4" />,
        label: "Add Member",
        href: "/members/add",
      },
      {
        icon: <UserX className="h-4 w-4" />,
        label: "View Members",
        href: "/members/view",
      },
    ],
  },

  {
    icon: <Users className="h-5 w-5" />,
    label: "All Users",
    href: "/users",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "All Groups",
    href: "/groups",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Add Choices",
    href: "/choices",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Onboarding",
    href: "/registration/email",
  },
  {
    icon: <Logs className="h-5 w-5" />,
    label: "Activity Logs",
    href: "/activity_logs",
  },
  {
    icon: <Logs className="h-5 w-5" />,
    label: "My activity logs",
    href: "/my-activity-logs",
  },
  {
    icon: <Mails className="h-5 w-5" />,
    label: "Email management",
    href: "#",
    subItems: [
      {
        icon: <MailPlus className="h-4 w-4" />,
        label: "Configurations",
        href: "/emails/configurations/",
      },
      {
        icon: <UserRound className="h-4 w-4" />,
        label: "Groups",
        href: "/emails/groups/",
      },
      {
        icon: <BetweenHorizonalStart className="h-4 w-4" />,
        label: "Add email to group",
        href: "/emails/add_email/",
      },
      {
        icon: <SquarePen className="h-4 w-4" />,
        label: "Compose email",
        href: "/emails/compose/",
      },
      {
        icon: <ExternalLink className="h-4 w-4" />,
        label: "Outbox",
        href: "/emails/outbox/",
      },
      {
        icon: <Settings className="h-4 w-4" />,
        label: "View all composes",
        href: "/emails/compose/view/",
      },
    ],
  },
  {
    icon: <HandPlatter className="h-5 w-5" />,
    label: "Restaurant management",
    href: "#",
    subItems: [
      {
        icon: <Soup className="h-4 w-4" />,
        label: "Restaurants",
        href: "/restaurants/",
      },
      {
        icon: <BookCheck className="h-4 w-4" />,
        label: "Add restaurants choices",
        href: "/restaurants/choices/",
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Add restaurant item",
        href: "/restaurants/items/add/",
      },
      {
        icon: <ListTodo className="h-4 w-4" />,
        label: "Add item category",
        href: "/restaurants/items/add/category/",
      },
      {
        icon: <Upload className="h-4 w-4" />,
        label: "Upload restaurant sales",
        href: "/restaurants/sales/upload/",
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "View cart",
        href: "/restaurants/checkout/",
      },
    ],
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: "Products Management",
    href: "#",
    subItems: [
      {
        icon: <Plus className="h-3 w-3" />,
        label: "Add Product",
        href: "/products/add/",
      },
      {
        icon: <Eye className="h-3 w-3" />,
        label: "View Products",
        href: "/products",
      },

      {
        icon: <List className="h-4 w-4" />,
        label: "Categories",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Category",
            href: "/products/categories/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Categories",
            href: "/products/categories/",
          },
        ],
      },
      {
        icon: <List className="h-4 w-4" />,
        label: "Brands",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Brand",
            href: "/products/brands/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Brands",
            href: "/products/brands/",
          },
        ],
      },
      {
        icon: <List className="h-4 w-4" />,
        label: "Media",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Media",
            href: "/products/media/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Media",
            href: "/products/media/",
          },
        ],
      },
      {
        icon: <BadgeDollarSign className="h-4 w-4" />,
        label: "Prices",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Product Price",
            href: "/products/prices/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Product Price",
            href: "/products/prices/",
          },
        ],
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Product Buy",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Product Cart",
            href: "/products/buy/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Product Cart",
            href: "/products/buy/",
          },
        ],
      },
    ],
  },
  {
    icon: <PercentCircle className="h-5 w-5" />,
    label: "Promo code management",
    href: "#",
    subItems: [
      {
        icon: <Code className="h-4 w-4" />,
        label: "View all promo codes",
        href: "/promo_codes/",
      },
      {
        icon: <CirclePlus className="h-4 w-4" />,
        label: "Add promo code",
        href: "/promo_codes/add/",
      },
      {
        icon: <TicketCheck className="h-4 w-4" />,
        label: "promo codes category",
        href: "/promo_codes/categories/",
      },
      {
        icon: <TicketPlus className="h-4 w-4" />,
        label: "Add category",
        href: "/promo_codes/categories/add/",
      },
      {
        icon: <Eye className="h-4 w-4" />,
        label: "View applied promo codes",
        href: "/promo_codes/applied_promo_codes/",
      },
    ],
  },

  {
    icon: <Wallet className="h-5 w-5" />,
    label: "Member financial management",
    href: "#",
    subItems: [
      {
        icon: <FileText className="h-4 w-4" />,
        label: "Invoices",
        href: "#",
        subItems: [
          {
            icon: <FileText className="h-3 w-3" />,
            label: "View all invoices",
            href: "/mfm/invoices",
          },
          {
            icon: <CircleDollarSign className="h-4 w-4" />,
            label: "Payment Invoice",
            href: "/mfm/payment_invoice",
          },
        ],
      },
      {
        icon: <CreditCard className="h-4 w-4" />,
        label: "Incomes",
        href: "#",
        subItems: [
          {
            icon: <CreditCard className="h-4 w-4" />,
            label: "View all incomes",
            href: "/mfm/income",
          },
          {
            icon: <ListChecks className="h-4 w-4" />,
            label: "View Income Particulars",
            href: "/mfm/income_particulars",
          },
          {
            icon: <CreditCard className="h-4 w-4" />,
            label: "View Income Receiving Options",
            href: "/mfm/income_receiving_options",
          },
        ],
      },
      {
        icon: <CreditCard className="h-4 w-4" />,
        label: "View Invoice PaymentOptions",
        href: "/mfm/payment_options",
      },

      {
        icon: <WalletCards className="h-4 w-4" />,
        label: "View all Sales",
        href: "/mfm/sales",
      },
      {
        icon: <FilePlus className="h-4 w-4" />,
        label: "View all Transactions",
        href: "/mfm/transections",
      },
      {
        icon: <ListChecks className="h-4 w-4" />,
        label: "View all Payments",
        href: "/mfm/payments",
      },
      {
        icon: <HandCoins className="h-4 w-4" />,
        label: "View member dues",
        href: "/mfm/view_member_dues",
      },
      {
        icon: <UserCheck className="h-4 w-4" />,
        label: "View member accounts",
        href: "/mfm/view_member_accounts",
      },
    ],
  },
  {
    icon: <Upload className="h-5 w-5" />,
    label: "Upload sales",
    href: "#",
    subItems: [
      {
        icon: <FileChartColumn className="h-4 w-4" />,
        label: "upload restaurant sale",
        href: "/restaurants/sales/upload",
      },
      {
        icon: <FileChartColumn className="h-4 w-4" />,
        label: "Upload lounge sale",
        href: "/upload/sales/lounge",
      },
      {
        icon: <FileChartColumn className="h-4 w-4" />,
        label: "Upload others sales",
        href: "/upload/sales/others",
      },
    ],
  },
];

/**
 * Mapping of navigation item labels to the required permission name.
 * If an item requires no permissions (e.g., Dashboard for all logged-in users), set it to null.
 * If a sub-item should be checked individually, define its permission here.
 */
export const navigationPermissions: Record<string, string | null> = {
  Dashboard: null,

  // MemberSphere
  MemberSphere: "member:view",
  "Pending Members": "member:edit",
  "Add Member": "member:create",
  "View Members": "member:view",
  "Transfer History": "member:history",
  "Recycle Bin": "member:delete",

  "All Users": "user:view_list",
  "All Groups": "group:view",
  "Add Choices": "member:view",
  Onboarding: "employee:onboard",
  "Activity Logs": "activity_log:view",
  "My activity logs": null,

  // Email management
  "Email management": "email:view_logs",
  Configurations: "email:template_edit",
  Groups: "email:view_logs",
  "Add email to group": "email:send_bulk",
  "Compose email": "email:send_single",
  Outbox: "email:view_logs",
  "View all composes": "email:view_logs",

  // Restaurant management
  "Restaurant management": "restaurant:view_menu",
  Restaurants: "restaurant:view_menu",
  "Add restaurants choices": "restaurant:menu_edit",
  "Add restaurant item": "restaurant:menu_edit",
  "Add item category": "restaurant:menu_edit",
  "Upload restaurant sales": "restaurant:menu_edit",
  "View cart": "restaurant:order_create",

  // Products Management
  "Products Management": "product:view",
  "Add Product": "product:create",
  "View Products": "product:view",
  Categories: "product:view",
  "Add Category": "product:create",
  "View Categories": "product:view",
  Brands: "product:view",
  "Add Brand": "product:create",
  "View Brands": "product:view",
  Media: "product:view",
  "Add Media": "product:create",
  "View Media": "product:view",
  Prices: "product:view",
  "Add Product Price": "product:create",
  "View Product Price": "product:view",
  "Product Buy": "product:view",
  "Add Product Cart": "product:create",
  "View Product Cart": "product:view",

  // Promo code management
  "Promo code": "promo_code:view",
  "Promo code management": "promo_code:view",
  "All promo codes": "promo_code:view",
  "View all promo codes": "promo_code:view",
  "Add promo code": "promo_code:create",
  "Promo codes category": "promo_code:view",
  "promo codes category": "promo_code:view",
  "Add category": "promo_code:create",
  "Applied promo codes": "promo_code:view",
  "View applied promo codes": "promo_code:view",

  // Member financial management
  "Member financial": "member_financial:view_invoices",
  "Member financial management": "member_financial:view_invoices",
  Invoices: "member_financial:view_invoices",
  "View all invoices": "member_financial:view_invoices",
  "Payment Invoice": "member_financial:generate_invoice",
  Incomes: "member_financial:view_incomes",
  "View all incomes": "member_financial:view_incomes",
  "Income Particulars": "member_financial:view_incomes",
  "View Income Particulars": "member_financial:view_incomes",
  "Receiving Options": "member_financial:view_incomes",
  "View Income Receiving Options": "member_financial:view_incomes",
  "Invoice Payment Options": "member_financial:adjust_dues",
  "View Invoice PaymentOptions": "member_financial:adjust_dues",
  "View all Sales": "member_financial:view_sales",
  "View all Transactions": "member_financial:view_transactions",
  "View all Payments": "member_financial:view_payments",
  "View member dues": "member_financial:view_dues",
  "View member accounts": "member_financial:view_accounts",

  "Upload sales": "member_financial:view_sales",
  "upload restaurant sale": "restaurant:menu_edit",
  "Upload lounge sale": "outlet:menu_edit",
  "Upload others sales": "member_financial:view_sales",

  "Facility management": "facility:view",
  Attendance: "attendance:view_records",
  "Outlets (Bar/Lounge)": "outlet:view_menu",
  Reservations: "reservation:view",
  Payroll: "payroll:view_structures",
  "Vendor Management": "vendor:view",
  "Event Management": "event:view",
  "Events": "event:view",
  "Venues": "event:edit",
  "Tickets": "event:view",
  "Fees": "event:edit",
  "Event Management > Media": "event:edit",
};

const sectionMasterMap: Record<string, string> = {
  "member:": "member_management",
  "member_financial:": "member_financial_management",
  "restaurant:": "restaurant_management",
  "outlet:": "outlet_management",
  "reservation:": "reservation_management",
  "facility:": "facility_management",
  "event:": "event_management",
  "attendance:": "attendance_management",
  "payroll:": "payroll_management",
  "vendor:": "vendor_management",
  "activity_log:": "activity_log_management",
  "group:": "group_permission_management",
  "employee:": "employee_onboarding",
  "user:": "view_all_users",
  "email:": "bulk_emails_management",
  "product:": "product_management",
  "promo_code:": "promo_code_management",
};

export const filterNavigationByPermissions = (
  navArray: any[],
  userPermissions: string[],
  isAdmin: boolean,
  parentLabel?: string
): any[] => {
  if (isAdmin) {
    return navArray;
  }

  const result: any[] = [];

  for (const item of navArray) {
    const lookupKey = parentLabel ? `${parentLabel} > ${item.label}` : item.label;
    const requiredPermission =
      navigationPermissions[lookupKey] !== undefined
        ? navigationPermissions[lookupKey]
        : navigationPermissions[item.label];
    let hasPermissionForItem = false;

    if (requiredPermission === null) {
      hasPermissionForItem = true;
    } else if (requiredPermission) {
      if (userPermissions.includes(requiredPermission)) {
        hasPermissionForItem = true;
      } else {
        for (const [prefix, masterPerm] of Object.entries(sectionMasterMap)) {
          if (requiredPermission.startsWith(prefix) && userPermissions.includes(masterPerm)) {
            hasPermissionForItem = true;
            break;
          }
        }
      }
    }

    if (item.subItems && item.subItems.length > 0) {
      const filteredSubItems = filterNavigationByPermissions(
        item.subItems,
        userPermissions,
        isAdmin,
        item.label
      );

      if (hasPermissionForItem || filteredSubItems.length > 0) {
        result.push({ ...item, subItems: filteredSubItems });
      }
    } else if (hasPermissionForItem) {
      result.push({ ...item });
    }
  }

  return result;
};
