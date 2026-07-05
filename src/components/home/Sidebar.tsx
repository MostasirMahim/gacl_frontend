"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/context/SidebarContext"
import { BRAND_CONFIG } from "@/config/brand"

interface SubItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
  subItems?: SubItem[]
  urls?: string[]
}

interface NavItemProps extends SubItem {
  level?: number
}

const NavItem = ({ icon, label, href, badge, subItems, urls = [], level = 0 }: NavItemProps) => {
  const pathname = usePathname()
  const { openKeys, setOpenKeys } = useSidebar()
  const key = label + href
  const isOpen = openKeys.includes(key)

  const isActive =
    (href && href !== "#" && pathname === href) ||
    urls.some((u) => pathname === u || pathname.startsWith(u)) ||
    (subItems ? hasActiveSubItem(subItems) : false)

  useEffect(() => {
    if (isActive && !isOpen) {
      setOpenKeys([...openKeys, key])
    }
  }, [pathname])

  function hasActiveSubItem(items?: SubItem[]): boolean {
    if (!items) return false
    return items.some((item) => {
      if (
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        item.urls?.some((u) => pathname === u || pathname.startsWith(u))
      ) {
        return true
      }
      return hasActiveSubItem(item.subItems)
    })
  }

  const toggleOpen = () => {
    setOpenKeys(isOpen ? openKeys.filter((k) => k !== key) : [...openKeys, key])
  }

  const paddingLeft = level * 16 + 12
  const buttonWidth = level > 1 ? "w-[85%]" : "w-[85%]"

  if (subItems && subItems.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={toggleOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              `${buttonWidth} hover:bg-accent hover:text-accent-foreground hover:translate-y-1 transition-all duration-300 ease-in-out justify-between gap-1 h-10 px-3 w-full`,
              isActive && "text-primary border border-border/50 rounded-xl my-1 shadow-sm",
            )}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              {icon}
              <span className="text-left truncate">{label}</span>
            </div>
            <div className="flex items-center">
              {badge && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full mr-2 shadow-sm">
                  {badge}
                </span>
              )}
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className={cn(`${isActive && (level == 1 ? "bg-primary/20 " : "bg-primary/10 ")} rounded-md`)}>
          <div className="space-y-1">
            {subItems.map((subItem, index) => (
              <NavItem
                key={index}
                icon={subItem.icon}
                label={subItem.label}
                href={subItem.href}
                badge={subItem.badge}
                subItems={subItem.subItems}
                urls={subItem.urls}
                level={level + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }
  return (
    <Link href={href} scroll={false}>
      <Button
        variant="ghost"
        className={cn(
          `${buttonWidth} hover:bg-accent hover:text-accent-foreground hover:translate-y-1 transition-all duration-300 ease-in-out justify-start gap-3 h-10 px-3 w-full my-1`,
          isActive && "bg-primary text-primary-foreground  rounded-xl shadow-md border border-primary/20",
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {icon}
        <span className="flex-1 text-left truncate">{label}</span>
        {badge && (
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full shadow-sm",
              isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground",
            )}
          >
            {badge}
          </span>
        )}
      </Button>
    </Link>
  )
}

const Sidebar = ({ navigation }: { navigation: NavItemProps[] }) => {
  return (
    <div className="flex flex-col max-h-screen overflow-y-auto font-primary">
      <div className="p-4 flex items-center justify-center border-b border-border/50">
        <img src={BRAND_CONFIG.logoUrl} alt={BRAND_CONFIG.companyName} className="object-contain rounded-full h-[120px] w-[120px] shadow-lg" />
      </div>
      <ScrollArea className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="space-y-1 px-2 mx-auto py-4">
          {navigation.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

export default Sidebar
