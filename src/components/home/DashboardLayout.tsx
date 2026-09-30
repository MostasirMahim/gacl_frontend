"use client"

import type React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserPlus,
  History,
  Trash2,
  IdCard,
  CalendarCheck2,
  Building2,
  Building,
  Plus,
  Eye,
  UtensilsCrossed,
  Store,
  Receipt,
  ChefHat,
  Utensils,
  FolderTree,
  SlidersHorizontal,
  FileSpreadsheet,
  Wine,
  CalendarRange,
  PartyPopper,
  MapPin,
  Ticket,
  BadgeDollarSign,
  ImageIcon,
  LineChart,
  Wallet,
  FileText,
  CircleDollarSign,
  BadgeCheck,
  AlertCircle,
  ArrowLeftRight,
  TrendingUp,
  ListChecks,
  CreditCard,
  Package,
  Award,
  Tag,
  ShoppingBag,
  UploadCloud,
  Layers,
  Percent,
  Truck,
  Banknote,
  Mail,
  Send,
  Inbox,
  Sliders,
  UserCog,
  ShieldCheck,
  ScrollText,
  Clock,
} from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { toast } from "react-toastify"
import axiosInstance from "@/lib/axiosInstance"

import Sidebar from "./Sidebar"
import { filterNavigationByPermissions } from "../utils/Navigation_functions"
import { LoadingDots, LoadingPage } from "../ui/loading"
import { SidebarProvider } from "@/context/SidebarContext"
import Navbar from "./Navbar"

const navigation_sidebar_links = [
  // ── SECTION 1: OVERVIEW ────────────────────────────────────
  {
    icon: <LayoutDashboard className="h-4 w-4" />,
    label: "Dashboard",
    href: "/",
  },

  // ── SECTION 2: MEMBERSHIP & SERVICES ───────────────────────
  {
    sectionTitle: "Membership & Services",
    icon: <Users className="h-4 w-4" />,
    label: "MemberSphere",
    href: "",
    subItems: [
      {
        icon: <Users className="h-3.5 w-3.5" />,
        label: "View Members",
        href: "/members/view",
        urls: ["/member/"],
      },
      {
        icon: <Clock className="h-3.5 w-3.5" />,
        label: "Pending Members",
        href: "/members/pending",
      },
      {
        icon: <UserPlus className="h-3.5 w-3.5" />,
        label: "Add Member",
        href: "/members/add",
      },
      {
        icon: <History className="h-3.5 w-3.5" />,
        label: "Transfer History",
        href: "/members/history",
      },
      {
        icon: <Trash2 className="h-3.5 w-3.5" />,
        label: "Recycle Bin",
        href: "/members/bin",
      },
    ],
  },
  {
    icon: <IdCard className="h-4 w-4" />,
    label: "Attendance",
    href: "/attendance",
  },
  {
    icon: <CalendarCheck2 className="h-4 w-4" />,
    label: "Reservations",
    href: "/reservations",
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    label: "Facilities",
    href: "#",
    subItems: [
      {
        icon: <Building className="h-3.5 w-3.5" />,
        label: "All Facilities",
        href: "/facilities",
      },
      {
        icon: <Plus className="h-3.5 w-3.5" />,
        label: "New Facility",
        href: "/facilities/create",
      },
    ],
  },

  // ── SECTION 3: HOSPITALITY & DINING ────────────────────────
  {
    sectionTitle: "Hospitality & Dining",
    icon: <UtensilsCrossed className="h-4 w-4" />,
    label: "Restaurant",
    href: "#",
    subItems: [
      {
        icon: <Store className="h-3.5 w-3.5" />,
        label: "Restaurants",
        href: "/restaurants",
      },
      {
        icon: <Receipt className="h-3.5 w-3.5" />,
        label: "Cart / POS",
        href: "/restaurants/checkout",
      },
      {
        icon: <ChefHat className="h-3.5 w-3.5" />,
        label: "Kitchen Orders",
        href: "/restaurant-orders",
      },
      {
        icon: <Utensils className="h-3.5 w-3.5" />,
        label: "Add Item",
        href: "/restaurants/items/add",
      },
      {
        icon: <FolderTree className="h-3.5 w-3.5" />,
        label: "Categories",
        href: "/restaurants/items/add/category",
      },
      {
        icon: <SlidersHorizontal className="h-3.5 w-3.5" />,
        label: "Menu Choices",
        href: "/restaurants/choices",
      },
      {
        icon: <FileSpreadsheet className="h-3.5 w-3.5" />,
        label: "Upload Sales",
        href: "/restaurants/sales/upload",
      },
    ],
  },
  {
    icon: <Wine className="h-4 w-4" />,
    label: "Outlets & Bars",
    href: "/outlets",
  },
  {
    icon: <CalendarRange className="h-4 w-4" />,
    label: "Events",
    href: "#",
    subItems: [
      {
        icon: <PartyPopper className="h-3.5 w-3.5" />,
        label: "Events",
        href: "/events",
        urls: ["/events/view"],
      },
      {
        icon: <MapPin className="h-3.5 w-3.5" />,
        label: "Venues",
        href: "/events/venues",
      },
      {
        icon: <Ticket className="h-3.5 w-3.5" />,
        label: "Tickets",
        href: "/events/tickets",
        urls: ["/events/tickets/"],
      },
      {
        icon: <BadgeDollarSign className="h-3.5 w-3.5" />,
        label: "Fees",
        href: "/events/fees",
      },
      {
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        label: "Media",
        href: "/events/media",
      },
    ],
  },

  // ── SECTION 4: FINANCIALS & COMMERCE ───────────────────────
  {
    sectionTitle: "Financials & Commerce",
    icon: <LineChart className="h-4 w-4" />,
    label: "Finance",
    href: "/finance",
  },
  {
    icon: <Wallet className="h-4 w-4" />,
    label: "Member Finance",
    href: "#",
    subItems: [
      {
        icon: <FileText className="h-3.5 w-3.5" />,
        label: "Invoices",
        href: "#",
        subItems: [
          {
            icon: <FileText className="h-3 w-3" />,
            label: "All Invoices",
            href: "/mfm/invoices",
          },
          {
            icon: <CircleDollarSign className="h-3 w-3" />,
            label: "Payment Invoice",
            href: "/mfm/payment_invoice",
          },
        ],
      },
      {
        icon: <BadgeCheck className="h-3.5 w-3.5" />,
        label: "Member Accounts",
        href: "/mfm/view_member_accounts",
      },
      {
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        label: "Member Dues",
        href: "/mfm/view_member_dues",
      },
      {
        icon: <ArrowLeftRight className="h-3.5 w-3.5" />,
        label: "Transactions",
        href: "/mfm/transections",
      },
      {
        icon: <CreditCard className="h-3.5 w-3.5" />,
        label: "Incomes",
        href: "#",
        subItems: [
          {
            icon: <TrendingUp className="h-3 w-3" />,
            label: "All Incomes",
            href: "/mfm/income",
          },
          {
            icon: <ListChecks className="h-3 w-3" />,
            label: "Particulars",
            href: "/mfm/income_particulars",
          },
          {
            icon: <CreditCard className="h-3 w-3" />,
            label: "Receiving Options",
            href: "/mfm/income_receiving_options",
          },
        ],
      },
      {
        icon: <CreditCard className="h-3.5 w-3.5" />,
        label: "Payment Options",
        href: "/mfm/payment_options",
      },
      {
        icon: <LineChart className="h-3.5 w-3.5" />,
        label: "All Sales",
        href: "/mfm/sales",
      },
      {
        icon: <ListChecks className="h-3.5 w-3.5" />,
        label: "Payments",
        href: "/mfm/payments",
      },
    ],
  },
  {
    icon: <Package className="h-4 w-4" />,
    label: "Products",
    href: "#",
    subItems: [
      {
        icon: <Eye className="h-3 w-3" />,
        label: "View Products",
        href: "/products",
      },
      {
        icon: <Plus className="h-3 w-3" />,
        label: "Add Product",
        href: "/products/add",
      },
      {
        icon: <FolderTree className="h-3.5 w-3.5" />,
        label: "Categories",
        href: "#",
        subItems: [
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Categories",
            href: "/products/categories",
          },
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Category",
            href: "/products/categories/add",
          },
        ],
      },
      {
        icon: <Award className="h-3.5 w-3.5" />,
        label: "Brands",
        href: "#",
        subItems: [
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Brands",
            href: "/products/brands",
          },
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Brand",
            href: "/products/brands/add",
          },
        ],
      },
      {
        icon: <ShoppingBag className="h-3.5 w-3.5" />,
        label: "Purchases",
        href: "#",
        subItems: [
          {
            icon: <Eye className="h-3 w-3" />,
            label: "Purchase Orders",
            href: "/products/buy",
          },
          {
            icon: <Plus className="h-3 w-3" />,
            label: "New Purchase",
            href: "/products/buy/add",
          },
        ],
      },
      {
        icon: <BadgeDollarSign className="h-3.5 w-3.5" />,
        label: "Prices",
        href: "#",
        subItems: [
          {
            icon: <Eye className="h-3 w-3" />,
            label: "Prices",
            href: "/products/prices",
          },
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Price",
            href: "/products/prices/add",
          },
        ],
      },
      {
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        label: "Media",
        href: "#",
        subItems: [
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Media",
            href: "/products/media",
          },
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Media",
            href: "/products/media/add",
          },
        ],
      },
    ],
  },
  {
    icon: <UploadCloud className="h-4 w-4" />,
    label: "Upload Sales",
    href: "#",
    subItems: [
      {
        icon: <UtensilsCrossed className="h-3.5 w-3.5" />,
        label: "Restaurant Sales",
        href: "/restaurants/sales/upload",
      },
      {
        icon: <Wine className="h-3.5 w-3.5" />,
        label: "Lounge Sales",
        href: "/upload/sales/lounge",
      },
      {
        icon: <Layers className="h-3.5 w-3.5" />,
        label: "Other Sales",
        href: "/upload/sales/others",
      },
    ],
  },
  {
    icon: <Percent className="h-4 w-4" />,
    label: "Promo Codes",
    href: "#",
    subItems: [
      {
        icon: <Tag className="h-3.5 w-3.5" />,
        label: "All Promos",
        href: "/promo_codes",
      },
      {
        icon: <Plus className="h-3.5 w-3.5" />,
        label: "New Promo",
        href: "/promo_codes/add",
      },
      {
        icon: <FolderTree className="h-3.5 w-3.5" />,
        label: "Categories",
        href: "/promo_codes/categories",
      },
      {
        icon: <Plus className="h-3.5 w-3.5" />,
        label: "Add category",
        href: "/promo_codes/categories/add",
      },
      {
        icon: <History className="h-3.5 w-3.5" />,
        label: "Applied Promos",
        href: "/promo_codes/applied_promo_codes",
      },
    ],
  },
  {
    icon: <Truck className="h-4 w-4" />,
    label: "Vendors",
    href: "/vendors",
  },

  // ── SECTION 5: HUMAN RESOURCES ─────────────────────────────
  {
    sectionTitle: "Human Resources",
    icon: <Banknote className="h-4 w-4" />,
    label: "Payroll",
    href: "/payroll",
  },
  {
    icon: <UserCheck className="h-4 w-4" />,
    label: "Onboarding",
    href: "/registration/email",
    urls: ["/registration/"],
  },

  // ── SECTION 6: ADMINISTRATION & SECURITY ───────────────────
  {
    sectionTitle: "Administration & Security",
    icon: <Mail className="h-4 w-4" />,
    label: "Emails",
    href: "",
    subItems: [
      {
        icon: <Send className="h-3.5 w-3.5" />,
        label: "Compose",
        href: "/emails/compose",
      },
      {
        icon: <Users className="h-3.5 w-3.5" />,
        label: "Groups",
        href: "/emails/groups",
      },
      {
        icon: <Plus className="h-3.5 w-3.5" />,
        label: "Add to Group",
        href: "/emails/add_email",
      },
      {
        icon: <Inbox className="h-3.5 w-3.5" />,
        label: "Outbox",
        href: "/emails/outbox",
      },
      {
        icon: <History className="h-3.5 w-3.5" />,
        label: "Sent History",
        href: "/emails/compose/view",
      },
      {
        icon: <Sliders className="h-3.5 w-3.5" />,
        label: "Configurations",
        href: "/emails/configurations",
        urls: ["/emails/configurations/add"],
      },
    ],
  },
  {
    icon: <UserCog className="h-4 w-4" />,
    label: "Users",
    href: "/users",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    label: "Groups",
    href: "/groups",
    urls: ["/groups/"],
  },
  {
    icon: <SlidersHorizontal className="h-4 w-4" />,
    label: "Choices",
    href: "/choices",
  },
  {
    icon: <ScrollText className="h-4 w-4" />,
    label: "Activity Logs",
    href: "/activity_logs",
  },
  {
    icon: <Clock className="h-4 w-4" />,
    label: "My Activity",
    href: "/my-activity-logs",
  },
]

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [navigation, setNavigation] = useState<any>([])
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate: logOutFunc, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete("/api/account/v1/logout/")
      return res.data
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        toast.success(data.message || "You have been logged out successfully.")
        await queryClient.invalidateQueries({ queryKey: ["authUser"] })
        router.replace("/login")
        router.refresh()
        window.location.reload()
      }
    },
    onError: (error: any) => {
      console.error("Error in Logout:", error?.response)
      const { message, errors, details } = error?.response.data
      if (errors) {
        errors?.map((error: any) => {
          toast.error(error?.message)
        })
      } else {
        toast.error(details || message || "Logout Failed")
      }
    },
  })

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    setMounted(true)
  }, [])

  const [userData, setUserData] = useState({
    is_admin: false,
    permissions: [],
    username: "",
  })

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const response = await axiosInstance.get("/api/account/v1/authorization/get_user_all_permissions/")
        const data = response.data

        if (data.status === "success") {
          const user = data.data[0]
          const permissionsList = user.permissions.map((p: any) => p.permission_name)
          setUserData({
            is_admin: user.is_admin,
            permissions: permissionsList,
            username: user?.username,
          })

          const filteredNav = filterNavigationByPermissions(navigation_sidebar_links, permissionsList, user.is_admin)
          setNavigation(filteredNav)
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error)
        setNavigation([])
      }
    }

    fetchUserPermissions()
  }, [])

  if (!mounted) {
    return null
  }

  if (isPending) return <LoadingPage text="Closing secure session and signing out…" />
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-muted/30 mx-auto">
        <aside className="hidden lg:block w-56 min-w-56 border-r min-h-screen border-border h-full overflow-y-auto sticky top-0 mx-auto shadow-sm">
          <Sidebar navigation={navigation} />
        </aside>

        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="p-0 w-56 bg-card border-border">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <Sidebar navigation={navigation} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar userData={userData} onLogout={() => logOutFunc()} onMenuClick={() => setIsMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 lg:p-4">
          <div className="bg-primary/5 dark:bg-card/40 w-full h-full p-2 sm:p-3 lg:p-4 rounded-xl shadow-sm border border-primary/15 dark:border-border/60">
            {children}</div></main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
