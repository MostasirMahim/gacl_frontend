"use client"

import React, { useEffect, Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Settings } from "lucide-react"
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
  sectionTitle?: string
}

interface NavItemProps extends SubItem {
  level?: number
}

const NavItem = ({ icon, label, href, badge, subItems, urls = [], level = 0 }: NavItemProps) => {
  const pathname = usePathname()
  const { openKeys, setOpenKeys } = useSidebar()
  const key = label + href
  const isOpen = openKeys.includes(key)

  const isExactActive = href && href !== "#" && pathname === href
  const isUrlActive = urls.some((u) => pathname === u || pathname.startsWith(u))
  const isSubActive = subItems ? hasActiveSubItem(subItems) : false
  const isActive = isExactActive || isUrlActive || isSubActive

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

  const isChild = level > 0

  if (subItems && subItems.length > 0) {
    return (
      <div className="relative group/nav-parent">
        {/* Branch connector line from vertical rail if nested */}
        {isChild && (
          <span
            className={cn(
              "absolute -left-[14px] top-4 w-2.5 h-[1.5px] rounded-full transition-colors pointer-events-none",
              isActive
                ? "bg-primary w-3 h-[2px]"
                : "bg-border/80 dark:bg-border/60 group-hover/nav-parent:bg-foreground/40"
            )}
          />
        )}
        <Collapsible open={isOpen} onOpenChange={toggleOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full transition-all justify-between gap-2 text-xs rounded-xl group/btn my-0.5 relative",
                isChild
                  ? "h-8 px-2.5 font-medium rounded-lg"
                  : "h-9 px-3 font-semibold",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 font-semibold shadow-xs"
                  : "text-foreground/75 dark:text-foreground/80 hover:text-foreground hover:bg-accent/70 dark:hover:bg-accent/40"
              )}
            >
              {/* Active left accent bar */}
              {isActive && !isChild && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full shadow-[0_0_6px_hsl(var(--primary)/0.6)]" />
              )}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-foreground/50 dark:text-foreground/40 group-hover/btn:text-foreground"
                  )}
                >
                  {icon}
                </span>
                <span className="text-left truncate tracking-tight">{label}</span>
              </div>
              <div className="flex items-center">
                {badge && (
                  <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full mr-1.5 font-semibold">
                    {badge}
                  </span>
                )}
                {isOpen ? (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform opacity-75 shrink-0",
                      isActive ? "text-primary" : "text-foreground/40 group-hover/btn:text-foreground"
                    )}
                  />
                ) : (
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 transition-transform opacity-75 shrink-0",
                      isActive ? "text-primary" : "text-foreground/40 group-hover/btn:text-foreground"
                    )}
                  />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(
              "relative space-y-0.5 my-1 transition-all",
              isChild
                ? "ml-3.5 pl-3 border-l-2 border-border/40 dark:border-border/25"
                : "ml-[22px] pl-3.5 border-l-2 border-border/50 dark:border-border/35"
            )}
          >
            <div className="space-y-0.5 py-0.5">
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
      </div>
    )
  }

  // Leaf Link Item
  return (
    <div className="relative group/nav-item">
      {/* Branch connector line from vertical rail if child item */}
      {isChild && (
        <span
          className={cn(
            "absolute -left-[14px] top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] rounded-full transition-colors pointer-events-none",
            isActive
              ? "bg-primary w-3 h-[2px]"
              : "bg-border/80 dark:bg-border/60 group-hover/nav-item:bg-foreground/40"
          )}
        />
      )}
      <Link href={href} scroll={false}>
        <Button
          variant="ghost"
          className={cn(
            "w-full transition-all justify-start gap-2.5 text-xs rounded-xl my-0.5 group/btn relative",
            isChild
              ? "h-8 px-2.5 font-medium rounded-lg"
              : "h-9 px-3 font-semibold",
            isActive
              ? "bg-primary/12 text-primary border border-primary/25 font-semibold shadow-xs"
              : "text-foreground/75 dark:text-foreground/80 hover:text-foreground hover:bg-accent/70 dark:hover:bg-accent/40"
          )}
        >
          {/* Active left accent bar for top-level items */}
          {isActive && !isChild && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full shadow-[0_0_6px_hsl(var(--primary)/0.6)]" />
          )}
          <span
            className={cn(
              "shrink-0 transition-colors",
              isActive
                ? "text-primary"
                : "text-foreground/50 dark:text-foreground/40 group-hover/btn:text-foreground"
            )}
          >
            {icon}
          </span>
          <span className="flex-1 text-left truncate tracking-tight">{label}</span>
          {badge && (
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                isActive ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
              )}
            >
              {badge}
            </span>
          )}
        </Button>
      </Link>
    </div>
  )
}

const Sidebar = ({ navigation }: { navigation: NavItemProps[] }) => {
  const pathname = usePathname()
  const isSettingsActive = pathname === "/settings"

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden font-primary bg-card border-r border-border/50">

      {/* ── Brand Header ─────────────────────────────────── */}
      <Link
        href="/"
        className="relative px-4 py-3.5 flex items-center gap-3 border-b border-border/50 shrink-0 cursor-pointer overflow-hidden group"
      >
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
        {/* Decorative circles */}
        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-primary/6 blur-md pointer-events-none" />
        <div className="absolute -bottom-4 -right-1 w-10 h-10 rounded-full bg-primary/8 blur-sm pointer-events-none" />

        {/* Logo */}
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center p-1.5 shadow-xs shrink-0 group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)] transition-all duration-200">
          <img
            src={BRAND_CONFIG.logoUrl}
            alt={BRAND_CONFIG.companyName}
            className="object-contain w-full h-full rounded-md"
          />
        </div>

        {/* Brand text */}
        <div className="relative min-w-0 flex-1">
          <h1 className="font-bold text-sm text-foreground tracking-tight truncate leading-tight group-hover:text-primary transition-colors duration-200">
            {BRAND_CONFIG.companyName || "Saint Club"}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-[10px] text-muted-foreground font-medium truncate">
              Enterprise Operations
            </p>
          </div>
        </div>
      </Link>

      {/* ── Navigation scroll area ────────────────────────── */}
      <ScrollArea className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="space-y-0.5 px-2.5 py-2.5">
          {navigation.map((item, index) => (
            <Fragment key={index}>
              {item.sectionTitle && (
                <div className={cn("px-3 pb-1 pt-3.5 select-none", index === 0 && "pt-1")}>
                  <p className="text-[10px] font-bold text-muted-foreground/60 dark:text-muted-foreground/50 uppercase tracking-widest font-secondary">
                    {item.sectionTitle}
                  </p>
                </div>
              )}
              <NavItem {...item} />
            </Fragment>
          ))}
        </nav>
      </ScrollArea>

      {/* ── Pinned Bottom Settings & Graphic ───────────────── */}
      <div className="shrink-0 border-t border-border/50 relative overflow-hidden bg-card">
        {/* Right side decorative CSS/SVG vector graphic matching the design with native theme colors */}
        <div className="absolute right-0 bottom-0 w-36 h-full pointer-events-none select-none z-0 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 150 60"
            preserveAspectRatio="xMaxYMax slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sidebarArcGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
              </linearGradient>
              <linearGradient id="sidebarArcGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
              </linearGradient>
              <radialGradient id="sidebarCornerGlow" cx="95%" cy="95%" r="80%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient soft glow */}
            <rect x="0" y="0" width="150" height="60" fill="url(#sidebarCornerGlow)" />

            {/* Broad smooth curved outer wave */}
            <path
              d="M 20 60 C 45 35, 80 18, 150 12 L 150 60 Z"
              fill="url(#sidebarArcGrad1)"
            />

            {/* Inner secondary wave */}
            <path
              d="M 60 60 C 85 42, 115 32, 150 30 L 150 60 Z"
              fill="url(#sidebarArcGrad2)"
            />

            {/* Delicate thin stroke arc */}
            <path
              d="M 10 60 C 40 28, 85 8, 150 4"
              stroke="hsl(var(--primary))"
              strokeOpacity="0.28"
              strokeWidth="1.2"
              fill="none"
            />

            {/* Floating delicate bubble circles */}
            {/* Upper circle */}
            <circle
              cx="134"
              cy="16"
              r="3.5"
              fill="hsl(var(--primary))"
              fillOpacity="0.22"
              stroke="hsl(var(--primary))"
              strokeOpacity="0.3"
              strokeWidth="0.6"
            />
            {/* Small dot near upper circle */}
            <circle
              cx="124"
              cy="24"
              r="1.5"
              fill="hsl(var(--primary))"
              fillOpacity="0.28"
            />

            {/* Lower circle */}
            <circle
              cx="142"
              cy="44"
              r="4.5"
              fill="hsl(var(--primary))"
              fillOpacity="0.16"
              stroke="hsl(var(--primary))"
              strokeOpacity="0.22"
              strokeWidth="0.6"
            />
            {/* Tiny accent dot */}
            <circle
              cx="130"
              cy="48"
              r="1.2"
              fill="hsl(var(--primary))"
              fillOpacity="0.25"
            />
          </svg>
        </div>

        {/* Subtle top gradient accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent relative z-10" />

        {/* Content with Settings on left in normal text, and version number on right */}
        <div className="relative z-10 px-3 py-2.5 flex items-center justify-between gap-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2 text-xs font-normal transition-colors cursor-pointer group/settings py-1 px-1.5 rounded-lg hover:bg-accent/60",
              isSettingsActive
                ? "text-foreground font-normal"
                : "text-foreground/80 hover:text-foreground"
            )}
          >
            <Settings
              className={cn(
                "w-4 h-4 transition-colors shrink-0",
                isSettingsActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover/settings:text-foreground"
              )}
            />
            <span className="tracking-tight font-normal text-foreground">Settings</span>
          </Link>

          <span className="text-[11px] font-mono font-medium text-muted-foreground/80 px-1.5 py-0.5 rounded bg-muted/60 dark:bg-muted/40 border border-border/50 select-none shadow-2xs">
            v2.0.1
          </span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
