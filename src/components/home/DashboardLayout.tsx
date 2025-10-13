"use client"

import type React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  LayoutDashboard,
  Users,
  FileText,
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
  History,
  Component,
  TableOfContents,
  Ticket,
  MapPinHouse,
  ImageIcon,
  UserCheck,
  Plus,
  Eye,
  Logs,
  UserCog,
  UserPlus,
  UsersRound,
  Layers,
  SquareUser,
  NotepadText,
  CombineIcon,
  CarFrontIcon as ChartGanttIcon,
  Slack,
  Trash2Icon,
} from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { toast } from "react-toastify"
import axiosInstance from "@/lib/axiosInstance"

import Sidebar from "./Sidebar"
import { filterNavigationByPermissions } from "../utils/Navigation_functions"
import { LoadingDots } from "../ui/loading"
import { SidebarProvider } from "@/context/SidebarContext"
import Navbar from "./Navbar"

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
        icon: <UserCog className="h-4 w-4" />,
        label: "Pending Members",
        href: "/members/pending",
      },
      {
        icon: <UserPlus className="h-4 w-4" />,
        label: "Add Member",
        href: "/members/add",
      },
      {
        icon: <UsersRound className="h-4 w-4" />,
        label: "View Members",
        href: "/members/view",
        urls: ["/member/"],
      },
      {
        icon: <History className="h-4 w-4" />,
        label: "Transfer History",
        href: "/members/history",
      },
      {
        icon: <Trash2Icon className="h-4 w-4" />,
        label: "Recycle Bin",
        href: "/members/bin",
      },
    ],
  },
  {
    icon: <SquareUser className="h-5 w-5" />,
    label: "All Users",
    href: "/users",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    label: "All Groups",
    href: "/groups",
    urls: ["/groups/"],
  },
  {
    icon: <NotepadText className="h-5 w-5" />,
    label: "Add Choices",
    href: "/choices",
  },
  {
    icon: <UserPlus className="h-5 w-5" />,
    label: "Onboarding",
    href: "/registration/email",
    urls: ["/registration/"],
  },
  {
    icon: <Logs className="h-5 w-5" />,
    label: "Activity Logs",
    href: "/activity_logs",
  },
  {
    icon: <List className="h-5 w-5" />,
    label: "My activity logs",
    href: "/my-activity-logs",
  },
  {
    icon: <Mails className="h-5 w-5" />,
    label: "Email management",
    href: "",
    subItems: [
      {
        icon: <MailPlus className="h-4 w-4" />,
        label: "Configurations",
        href: "/emails/configurations",
        urls: ["/emails/configurations/add"],
      },
      {
        icon: <UserRound className="h-4 w-4" />,
        label: "Groups",
        href: "/emails/groups",
      },
      {
        icon: <BetweenHorizonalStart className="h-4 w-4" />,
        label: "Add email to group",
        href: "/emails/add_email",
      },
      {
        icon: <SquarePen className="h-4 w-4" />,
        label: "Compose email",
        href: "/emails/compose",
      },
      {
        icon: <ExternalLink className="h-4 w-4" />,
        label: "Outbox",
        href: "/emails/outbox",
      },
      {
        icon: <Settings className="h-4 w-4" />,
        label: "View all composes",
        href: "/emails/compose/view",
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
        href: "/restaurants",
      },
      {
        icon: <BookCheck className="h-4 w-4" />,
        label: "Add restaurants choices",
        href: "/restaurants/choices",
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Add restaurant item",
        href: "/restaurants/items/add",
      },
      {
        icon: <ListTodo className="h-4 w-4" />,
        label: "Add item category",
        href: "/restaurants/items/add/category",
      },
      {
        icon: <Upload className="h-4 w-4" />,
        label: "Upload restaurant sales",
        href: "/restaurants/sales/upload",
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "View cart",
        href: "/restaurants/checkout",
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
        href: "/products/add",
      },
      {
        icon: <Eye className="h-3 w-3" />,
        label: "View Products",
        href: "/products",
      },
      {
        icon: <ChartGanttIcon className="h-4 w-4" />,
        label: "Categories",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Category",
            href: "/products/categories/add",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Categories",
            href: "/products/categories",
          },
        ],
      },
      {
        icon: <Slack className="h-4 w-4" />,
        label: "Brands",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Brand",
            href: "/products/brands/add",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Brands",
            href: "/products/brands",
          },
        ],
      },
      {
        icon: <ImageIcon className="h-4 w-4" />,
        label: "Media",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Media",
            href: "/products/media/add",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Media",
            href: "/products/media",
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
            href: "/products/prices/add",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Product Price",
            href: "/products/prices",
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
            href: "/products/buy/add",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Product Cart",
            href: "/products/buy",
          },
        ],
      },
    ],
  },
  {
    icon: <PercentCircle className="h-5 w-5" />,
    label: "Promo code",
    href: "#",
    subItems: [
      {
        icon: <Code className="h-4 w-4" />,
        label: "All promo codes",
        href: "/promo_codes",
      },
      {
        icon: <CirclePlus className="h-4 w-4" />,
        label: "Add promo code",
        href: "/promo_codes/add",
      },
      {
        icon: <TicketCheck className="h-4 w-4" />,
        label: "Promo codes category",
        href: "/promo_codes/categories",
      },
      {
        icon: <TicketPlus className="h-4 w-4" />,
        label: "Add category",
        href: "/promo_codes/categories/add",
      },
      {
        icon: <Eye className="h-4 w-4" />,
        label: "Applied promo codes",
        href: "/promo_codes/applied_promo_codes",
      },
    ],
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    label: "Member financial",
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
            label: "Income Particulars",
            href: "/mfm/income_particulars",
          },
          {
            icon: <CreditCard className="h-4 w-4" />,
            label: "Receiving Options",
            href: "/mfm/income_receiving_options",
          },
        ],
      },
      {
        icon: <CreditCard className="h-4 w-4" />,
        label: "Invoice Payment Options",
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
  {
    icon: <CombineIcon className="h-5 w-5" />,
    label: "Facility management",
    href: "#",
    subItems: [
      {
        icon: <CirclePlus className="h-4 w-4" />,
        label: "Create facility",
        href: "/facilities/create",
      },
      {
        icon: <Eye className="h-4 w-4" />,
        label: "View facilities",
        href: "/facilities",
      },
    ],
  },
  {
    icon: <Component className="h-5 w-5" />,
    label: "Event Management",
    href: "#",
    subItems: [
      {
        icon: <TableOfContents className="h-4 w-4" />,
        label: "Events",
        href: "/events",
        urls: ["/events/view"],
      },
      {
        icon: <MapPinHouse className="h-4 w-4" />,
        label: "Venues",
        href: "/events/venues",
      },
      {
        icon: <Ticket className="h-4 w-4" />,
        label: "Tickets",
        href: "/events/tickets",
        urls:["/events/tickets/"]
      },
      {
        icon: <HandCoins className="h-4 w-4" />,
        label: "Fees",
        href: "/events/fees",
      },
      {
        icon: <ImageIcon className="h-4 w-4" />,
        label: "Media",
        href: "/events/media",
      },
    ],
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

  if (isPending) return <LoadingDots />
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-muted/30 mx-auto">
        <aside className="hidden lg:block w-64 min-w-64 border-r min-h-screen border-border h-full overflow-y-auto sticky top-0 mx-auto shadow-sm">
          <Sidebar navigation={navigation} />
        </aside>

        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-card border-border">
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
          <div className="bg-primary/5 w-full h-full p-2 sm:p-3 lg:p-4 rounded-xl shadow-lg border border-border">
            {children}</div></main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
