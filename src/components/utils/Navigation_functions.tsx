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
    href: "/activity_logs/my",
  },
  ,
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
  Dashboard: null, // Always show

  // MemberSphere - We can permission the entire section or individual sub-items.
  MemberSphere: "member_management", // Example: A general permission for the
  "Add Choices": "member_management", // Define permission if needed
  "All Users": "view_all_users",
  "All Groups": "group_permission_management",
  Onboarding: "employee_onboarding",
  "Activity Logs": "activity_log_management",
  "My activity logs": null,
  "Email management": "bulk_emails_management",
  "Restaurant management": "restaurant_management",
  "Products Management": "product_management",
  "Promo code": "promo_code_management",
  "Member financial": "member_financial_management",
  "Upload sales": "member_financial_management",
  "Facility management": "facility_management",
  "Attendance": "attendance_management",
  "Outlets (Bar/Lounge)": "outlet_management",
  "Reservations": "reservation_management",
  "Payroll": "payroll_management",
  "Vendor Management": "vendor_management",
  "Finance & Reports": "member_financial_management",
  "Event Management": "event_management",
};

// lib/navigation-permissions.ts

// ... (previous code)

/**
 * Recursively filters the navigation array based on user permissions.
 * @param navArray The navigation array to filter
 * @param userPermissions Array of permission names the user has
 * @param isAdmin Whether the user is an admin (sees everything)
 * @returns Filtered navigation array
 */
export const filterNavigationByPermissions = (
  navArray: any[],
  userPermissions: string[],
  isAdmin: boolean
): any[] => {
  // If user is admin, return the entire navigation tree without filtering.
  if (isAdmin) {
    return navArray;
  }

  return navArray.filter((item) => {
    // Get the required permission for this specific item by its label
    const requiredPermission = navigationPermissions[item.label];

    // Check if the user has the required permission for this item.
    // If requiredPermission is null, the item is always shown.
    const hasPermissionForItem =
      requiredPermission === null ||
      userPermissions.includes(requiredPermission);

    // If the item has sub-items, we need to filter them first.
    if (item.subItems && item.subItems.length > 0) {
      // Recursively filter the sub-items
      const filteredSubItems = filterNavigationByPermissions(
        item.subItems,
        userPermissions,
        isAdmin
      );

      // After filtering the children, check two things:
      // 1. Does the user have permission to see this parent item?
      // 2. OR are there any remaining (allowed) sub-items?
      // If either is true, we keep the parent item, but with the filtered sub-items.
      if (hasPermissionForItem || filteredSubItems.length > 0) {
        // Return a copy of the item with the filtered sub-items
        return { ...item, subItems: filteredSubItems };
      }

      // If the user has no permission for the parent AND no children are left, hide the entire item.
      return false;
    }

    // If it's a simple item with no sub-items, just check its permission.
    return hasPermissionForItem;
  });
};
