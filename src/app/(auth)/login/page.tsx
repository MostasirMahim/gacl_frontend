"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "@/hooks/data/useAuthUser";
import { LoadingDots } from "@/components/ui/loading";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { BRAND_CONFIG } from "@/config/brand";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  Trophy,
  UtensilsCrossed,
  ReceiptText,
} from "lucide-react";

const validationSchema = Yup.object({
  username: Yup.string().required("Username or Member ID is required"),
  password: Yup.string().required("Password is required"),
});

type LoginFormValues = {
  username: string;
  password: string;
  remember_me: boolean;
};

export default function LoginPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: user, isLoading } = useAuthUser();
  const [showPassword, setShowPassword] = useState(false);

  // Force pure light mode for Auth page regardless of system or stored theme
  useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains("dark");
    if (hadDark) {
      html.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
      router.refresh();
    }
  }, [user, isLoading, router]);

  const { mutate: loginFunc, isPending } = useMutation({
    mutationFn: async (formData: LoginFormValues) => {
      const res = await axiosInstance.post("/api/account/v1/login/", formData);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.code === 200 && data.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["authUser"] });
        toast.success("Login successful.");

        const isMember = data.role?.toUpperCase() === "MEMBER";
        if (data.must_change_password) {
          toast.info("Please set a new password to continue.");
          if (isMember) {
            router.replace("/portal/reset-password");
          } else {
            router.replace("/reset-password");
          }
        } else {
          if (isMember) {
            router.replace("/portal");
          } else {
            router.replace("/");
          }
        }
        router.refresh();
      }
    },
    onError: (error: any) => {
      console.error("Error in Login", error?.response);
      const { message, errors } = error?.response?.data || {};

      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : (messages as string),
          );
        });
      } else if (message) {
        toast.error(message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember_me: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      loginFunc(values);
    },
  });

  if (isLoading) return <LoadingDots />;
  if (user) return null;

  return (
    <main
      className="light relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-[#eef4fd] text-slate-800 flex items-center justify-center selection:bg-blue-100 selection:text-blue-900"
      style={{ colorScheme: "light" }}
    >
      {/* Scoped CSS to eliminate any browser dark/black outline glitch on input focus */}
      <style jsx global>{`
        .auth-input {
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .auth-input:focus,
        .auth-input:focus-visible,
        .auth-input:active {
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(26, 108, 240, 0.16) !important;
          border-color: #1a6cf0 !important;
          --tw-ring-color: rgba(26, 108, 240, 0.16) !important;
          --tw-ring-offset-shadow: none !important;
        }
        .auth-input-error:focus,
        .auth-input-error:focus-visible,
        .auth-input-error:active {
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.16) !important;
          border-color: #ef4444 !important;
        }
      `}</style>

      {/* Background Layer with Fluid Soft Waves */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{ backgroundImage: "url('/assets/auth/auth_bg.png')" }}
      />

      {/* Main Single-Screen Layout Container */}
      <div className="relative z-10 w-full max-w-[1660px] h-full mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-8 lg:px-12 xl:px-16 py-4 lg:py-5 gap-6 lg:gap-10">
        {/* Left Column: Brand & Features & Clubhouse Building (Desktop Only: lg and above) */}
        <section className="hidden lg:flex w-full lg:w-[46%] xl:w-[45%] flex-col justify-between self-stretch h-full py-1">
          <div>
            {/* Top Brand Logo */}
            <div className="flex items-center gap-2.5 mb-3 lg:mb-4">
              <div className="w-9 h-9 relative flex-shrink-0 drop-shadow-sm">
                <Image
                  src="/assets/auth/saint_club_logo.png"
                  alt="Saint Club Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Saint Club
                </h2>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Club Management System
                </p>
              </div>
            </div>

            {/* Hero Headline & Clean Subtitle */}
            <div className="space-y-1.5 max-w-lg">
              <h1 className="text-3xl sm:text-4xl lg:text-[38px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Better Club.
                <br />
                <span className="text-[#1a6cf0]">Smarter Management.</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-md pt-0.5">
                The all-in-one digital platform for Gregorian Athletic Club, seamlessly
                connecting member services, dining, sports facilities, and club operations.
              </p>
            </div>

            {/* 4 Feature Circles: Compact & Sleek */}
            <div className="grid grid-cols-4 gap-2 max-w-[340px] sm:max-w-[360px] mt-3.5 lg:mt-4">
              {/* Feature 1: Member Services */}
              <div className="flex flex-col items-center text-center gap-1 group cursor-default">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-blue-100 shadow-[0_2px_8px_rgba(26,108,240,0.06)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(26,108,240,0.14)]">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a6cf0]" />
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-medium text-slate-600 leading-tight max-w-[72px]">
                  Member{"\n"}Services
                </span>
              </div>

              {/* Feature 2: Sports & Courts */}
              <div className="flex flex-col items-center text-center gap-1 group cursor-default">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-blue-100 shadow-[0_2px_8px_rgba(26,108,240,0.06)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(26,108,240,0.14)]">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a6cf0]" />
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-medium text-slate-600 leading-tight max-w-[72px]">
                  Sports &{"\n"}Courts
                </span>
              </div>

              {/* Feature 3: Dining & Lounges */}
              <div className="flex flex-col items-center text-center gap-1 group cursor-default">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-blue-100 shadow-[0_2px_8px_rgba(26,108,240,0.06)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(26,108,240,0.14)]">
                  <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a6cf0]" />
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-medium text-slate-600 leading-tight max-w-[72px]">
                  Dining &{"\n"}Lounges
                </span>
              </div>

              {/* Feature 4: Accounts & Billing */}
              <div className="flex flex-col items-center text-center gap-1 group cursor-default">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-blue-100 shadow-[0_2px_8px_rgba(26,108,240,0.06)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(26,108,240,0.14)]">
                  <ReceiptText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1a6cf0]" />
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-medium text-slate-600 leading-tight max-w-[72px]">
                  Accounts &{"\n"}Billing
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Left: Clubhouse Building (Flush to Screen Bottom) */}
          <div className="mt-auto relative w-full flex items-end justify-start -mb-3 lg:-mb-5">
            <div className="relative w-full max-w-[540px] lg:max-w-[620px] xl:max-w-[680px] aspect-[1536/1024] max-h-[250px] lg:max-h-[290px] xl:max-h-[320px] pointer-events-none drop-shadow-2xl -ml-6 lg:-ml-10">
              <Image
                src="/assets/auth/saint_club_image.png"
                alt="Saints Club Clubhouse"
                fill
                className="object-contain object-bottom-left"
                priority
              />
            </div>
          </div>
        </section>

        {/* Right Column: Responsive Auth Card (Optimized for Mobile, Tablet & Desktop) */}
        <section className="w-full lg:w-[54%] xl:w-[55%] flex items-center justify-center">
          <div className="w-full max-w-[440px] md:max-w-[800px] lg:max-w-[960px] xl:max-w-[1020px] bg-white rounded-[22px] sm:rounded-[26px] shadow-[0_20px_50px_-12px_rgba(20,60,140,0.18),0_2px_12px_rgba(0,0,0,0.04)] border border-white/90 overflow-hidden flex flex-col md:flex-row relative">
            {/* Left Panel on Tablet/Desktop / Compact Top Banner on Mobile */}
            <div className="w-full md:w-[41%] lg:w-[40%] xl:w-[39%] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 lg:p-7 select-none text-white flex-shrink-0 bg-gradient-to-br from-[#1b6cf0] via-[#155bd9] to-[#0a3ca8]">
              {/* Ambient Glows */}
              <div className="absolute -top-14 -left-14 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />

              {/* Upper Background Graphics: Serial Dots Matrix Only */}
              <div className="absolute top-3 right-4 grid grid-cols-6 gap-2.5 opacity-25 pointer-events-none select-none">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
                ))}
              </div>

              {/* Gradient Wave Shapes at Bottom of Blue Panel (Desktop/Tablet) */}
              <div className="hidden md:block absolute inset-x-0 bottom-0 h-44 overflow-hidden pointer-events-none select-none z-0">
                <svg
                  className="absolute bottom-0 left-0 w-full h-full"
                  viewBox="0 0 320 160"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="blueWaveGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#2563eb" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
                    </linearGradient>
                    <linearGradient id="blueWaveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
                      <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M-20 115 C50 65 140 140 240 90 C280 70 315 85 340 100 L340 170 L-20 170 Z"
                    fill="url(#blueWaveGrad1)"
                  />
                  <path
                    d="M-20 150 C60 100 150 75 230 120 C275 145 310 115 340 95 L340 170 L-20 170 Z"
                    fill="url(#blueWaveGrad2)"
                  />
                </svg>
              </div>

              {/* Text Header */}
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-[0.22em] text-[#67e8f9] uppercase inline-block drop-shadow-sm">
                  WELCOME BACK
                </span>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-1 tracking-tight leading-snug drop-shadow-sm">
                  Access your
                  <br className="hidden md:inline" />{" "}
                  Saint Club portal
                </h2>
                <p className="text-xs sm:text-[13px] text-blue-50 font-normal leading-relaxed mt-1 sm:mt-1.5 max-w-[260px] drop-shadow-sm">
                  Sign in to continue to your Saint Club account.
                </p>
              </div>

              {/* 3D POS Graphic: Show on Tablet/Desktop, Hidden on Mobile Phone for Compact Ergonomics */}
              <div className="hidden md:flex relative z-10 flex-1 items-center justify-center py-2">
                <div className="relative w-full aspect-[1095/815] max-h-[180px] lg:max-h-[210px] xl:max-h-[230px] drop-shadow-2xl">
                  <Image
                    src="/assets/auth/login_graphics.png"
                    alt="Club Operations & POS"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right Panel: Clean Login Form */}
            <div className="w-full md:w-[59%] lg:w-[60%] xl:w-[61%] p-5 sm:p-7 lg:p-9 xl:p-10 flex flex-col justify-between bg-white relative">
              {/* Header: Saint Club Logo Badge */}
              <div className="flex items-center gap-3 pb-2.5 mb-4 sm:mb-5 border-b border-slate-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-blue-100 shadow-[0_4px_16px_rgba(26,108,240,0.12)] flex items-center justify-center p-1.5 flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 relative">
                    <Image
                      src="/assets/auth/saint_club_logo.png"
                      alt="Saint Club Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                    Saint Club
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                    Club Management System
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Username */}
                <div className="space-y-1">
                  <label
                    htmlFor="username"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Username or Member ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username or member ID"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      className={`auth-input w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 ${
                        formik.touched.username && formik.errors.username
                          ? "auth-input-error border-red-400"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    />
                  </div>
                  {formik.touched.username && formik.errors.username && (
                    <p className="text-red-500 text-[11px] pl-1 font-medium">
                      {formik.errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className={`auth-input w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 ${
                        formik.touched.password && formik.errors.password
                          ? "auth-input-error border-red-400"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-[11px] pl-1 font-medium">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox
                      id="remember_me"
                      name="remember_me"
                      checked={formik.values.remember_me}
                      onCheckedChange={(checked) =>
                        formik.setFieldValue("remember_me", checked)
                      }
                      className="border-slate-300 data-[state=checked]:bg-[#1a6cf0] data-[state=checked]:border-[#1a6cf0] rounded"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      Remember this device
                    </span>
                  </label>
                  <Link
                    href="/forget-password/email"
                    className="text-xs font-medium text-[#1a6cf0] hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#1a6cf0] to-[#2575fc] hover:from-[#155bd9] hover:to-[#1a6cf0] shadow-md shadow-[#1a6cf0]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-1.5"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Minimal Clean Help Link */}
              <p className="text-xs text-slate-500 text-center mt-3 pt-1">
                Need help?{" "}
                <a
                  href={`mailto:${BRAND_CONFIG.contactEmail || "admin@saintclub.com"}`}
                  className="text-[#1a6cf0] hover:underline font-medium"
                >
                  Contact your administrator
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
