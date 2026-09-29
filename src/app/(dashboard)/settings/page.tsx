"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Check,
  SunIcon,
  MoonIcon,
  LaptopIcon,
  Palette,
  Sparkles,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useThemeStore } from "@/store/theme_store";
import { themes } from "@/config/themes";

const Settings = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const { theme: mode, setTheme: setMode, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeColorMode = resolvedTheme === "dark" ? "dark" : "light";

  const themeList = [
    { name: "blue", label: "Ocean Blue" },
    { name: "green", label: "Emerald Green" },
    { name: "violet", label: "Royal Violet" },
    { name: "orange", label: "Sunset Orange" },
    { name: "rose", label: "Crimson Rose" },
    { name: "red", label: "Vibrant Red" },
    { name: "yellow", label: "Warm Amber" },
    { name: "slate", label: "Cool Slate" },
    { name: "zinc", label: "Modern Zinc" },
    { name: "stone", label: "Natural Stone" },
    { name: "gray", label: "Minimal Gray" },
    { name: "neutral", label: "Soft Neutral" },
  ];

  const modeOptions = [
    {
      value: "light",
      label: "Light Mode",
      desc: "Bright, clean daylight interface with crisp contrast",
      icon: SunIcon,
    },
    {
      value: "dark",
      label: "Dark Mode",
      desc: "Refined deep slate aesthetic designed for focus",
      icon: MoonIcon,
    },
    {
      value: "system",
      label: "System Sync",
      desc: "Automatically adapts to your device OS settings",
      icon: LaptopIcon,
    },
  ];

  if (!mounted) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-md" />
        <div className="h-4 w-96 bg-muted/60 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="h-28 bg-muted rounded-xl" />
          <div className="h-28 bg-muted rounded-xl" />
          <div className="h-28 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 font-primary">
      {/* Page Header */}
      <div className="space-y-1.5 border-b border-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          Appearance & Customization
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Theme & Display Settings
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Personalize your dashboard experience. Switch between light and dark
          modes or select an accent color palette tailored to your workflow.
        </p>
      </div>

      {/* 1. Interface Display Mode */}
      <Card className="border border-border/70 shadow-xs bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <SunIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Interface Mode</CardTitle>
              <CardDescription className="text-xs">
                Select your preferred color contrast and illumination mode
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {modeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMode(opt.value)}
                  className={cn(
                    "flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer relative group text-foreground",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                      : "border-border/70 bg-card hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "bg-muted text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80"
                      )}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-sm leading-tight text-foreground">
                    {opt.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 leading-normal">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Color Palette / Theme */}
      <Card className="border border-border/70 shadow-xs bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Accent Palette</CardTitle>
                <CardDescription className="text-xs">
                  Choose the dominant color for buttons, active indicators, and highlights
                </CardDescription>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {themeList.find((t) => t.name === theme)?.label || theme}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {themeList.map(({ name, label }) => {
              const themeObj = themes.find((t) => t.name === name);
              const isActive = theme === name;
              const colorValue =
                themeObj?.activeColor[activeColorMode] || "221.2 83.2% 53.3%";

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTheme(name)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-3.5 rounded-xl border transition-all cursor-pointer group text-center",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs"
                      : "border-border/70 bg-card hover:border-border hover:bg-muted/40"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-2xs",
                      isActive
                        ? "ring-2 ring-offset-2 ring-primary ring-offset-background"
                        : "border border-border/40"
                    )}
                    style={{ backgroundColor: `hsl(${colorValue})` }}
                  >
                    {isActive && (
                      <Check className="w-4 h-4 text-white drop-shadow-xs" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block text-foreground truncate">
                      {label}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Live Component Preview */}
      <Card className="border border-border/70 shadow-xs bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Live Component Preview</CardTitle>
              <CardDescription className="text-xs">
                Real-time preview of interactive controls rendered in your selected theme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-5 rounded-xl border border-border/60 bg-muted/20 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button className="cursor-pointer shadow-xs gap-1.5">
                <Check className="w-4 h-4" /> Primary Button
              </Button>
              <Button variant="outline" className="cursor-pointer shadow-xs">
                Outline Button
              </Button>
              <Button variant="secondary" className="cursor-pointer">
                Secondary Button
              </Button>
              <Button variant="ghost" className="cursor-pointer">
                Ghost Button
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground font-medium mr-2">
                Badges & Tags:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-2xs">
                Primary
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                Subtle Pill
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                Neutral
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Success
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;