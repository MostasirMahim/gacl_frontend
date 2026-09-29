"use client";
import type React from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Maximize, Menu, Minimize, Search, Bell, Settings, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

interface NavbarProps {
  userData: {
    username?: string;
  };
  onLogout: () => void;
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userData, onLogout, onMenuClick }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = async () => {
    if (!isFullScreen) {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 sm:px-6 shadow-xs">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Global Search with refined radius, border, and shadow */}
      <div className="relative w-72 sm:w-80 md:w-96 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground/50 pointer-events-none" />
        <input
          type="text"
          placeholder="Search members, transactions, orders..."
          className="w-full h-9 bg-card/90 border border-border/85 dark:border-border/70 rounded-lg pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground/70 focus:bg-card focus:outline-none focus:ring-1.5 focus:ring-primary/40 focus:border-primary shadow-xs transition-all font-medium"
        />
        <kbd className="absolute right-2.5 top-2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-foreground/60 bg-muted/80 border border-border/70 rounded select-none shadow-2xs">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Notifications Bell */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative h-9 w-9 rounded-lg border border-border/80 dark:border-border/60 bg-card/90 shadow-xs hover:bg-accent hover:border-border text-foreground/75 hover:text-foreground transition-all cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Fullscreen"
          onClick={toggleFullScreen}
          className="relative hidden sm:flex h-9 w-9 rounded-lg border border-border/80 dark:border-border/60 bg-card/90 shadow-xs hover:bg-accent hover:border-border text-foreground/75 hover:text-foreground transition-all cursor-pointer"
        >
          {isFullScreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>

        {/* User Profile Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2.5 h-9 pl-1.5 pr-3 rounded-lg border border-border/80 dark:border-border/60 bg-card/90 shadow-xs hover:bg-muted/70 dark:hover:bg-accent hover:border-border transition-all cursor-pointer group"
            >
              <div className="relative">
                <div className="w-6.5 h-6.5 rounded-md bg-gradient-to-tr from-primary/25 via-primary/10 to-primary/30 border border-primary/35 flex items-center justify-center text-primary font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                  <svg
                    viewBox="0 0 64 64"
                    fill="currentColor"
                    className="w-4.5 h-4.5 text-primary drop-shadow-xs"
                  >
                    <circle cx="32" cy="18" r="12" />
                    <path d="M32 34c-11 0-21.7 5.7-26.3 15.3-.8 1.8.6 3.7 2.6 3.7h47.4c2 0 3.4-1.9 2.6-3.7C53.7 39.7 43 34 32 34zm0 18l-5-14h10l-5 14z" />
                  </svg>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-background shadow-xs" />
              </div>
              <div className="hidden xl:flex items-center gap-2">
                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-semibold text-foreground whitespace-nowrap group-hover:text-primary transition-colors">
                    {userData?.username || "Admin User"}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap font-medium">
                    {userData?.username ? "Club Executive" : "Administrator"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-56 p-1.5 bg-popover text-popover-foreground border border-border shadow-xl rounded-xl z-50"
          >
            {/* User Account Info Header */}
            <div className="px-2.5 py-2 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {(userData?.username || "A").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {userData?.username || "Admin User"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate font-medium">
                  {userData?.username ? "Club Executive" : "Administrator"}
                </span>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-border my-1" />

            <DropdownMenuItem asChild>
              <Link
                href="/reset-password"
                className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-normal text-foreground hover:bg-muted focus:bg-muted rounded-md cursor-pointer transition-colors w-full"
              >
                <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>Reset Password</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs font-normal text-foreground hover:bg-muted focus:bg-muted rounded-md cursor-pointer transition-colors w-full"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>Settings</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground font-normal">
                  v2.0.1
                </span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border my-1" />

            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive rounded-md cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
