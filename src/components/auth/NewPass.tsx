"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForgetPassStore } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

export default function SetNewPasswordForm() {
  const router = useRouter();
  const { email, otp, token, reset } = useForgetPassStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!email || !otp) {
      router.push("/forget-password/email");
    }
  }, [email, otp, router]);

  const { mutate: newFpass, isPending } = useMutation({
    mutationFn: async (userInfo: {
      email: string;
      password: string;
      token: string;
    }) => {
      const res = await axiosInstance.post(
        "/api/account/v1/reset_password/",
        userInfo
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        setIsSuccess(true);
        toast.success(data.message || "Password reset successfully.");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    },
    onError: (error: any) => {
      console.error("Error in Reset Password:", error);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : (messages as string)
          );
        });
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "Verification Failed");
      } else {
        toast.error(detail || message || "Verification Failed");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.newPassword === values.confirmPassword) {
        newFpass({
          email: email,
          password: values.newPassword,
          token: token,
        });
      }
    },
  });

  const handleBack = () => {
    formik.resetForm();
    router.push("/forget-password/otp");
  };

  const handleComplete = () => {
    reset();
    router.replace("/login");
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 py-2 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600" />
        </div>

        <div className="space-y-1">
          <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Password Reset Complete
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-sm mx-auto">
            Your password has been successfully updated. You can now sign in with your new credentials.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleComplete}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#1a6cf0] to-[#2575fc] hover:from-[#155bd9] hover:to-[#1a6cf0] shadow-md shadow-[#1a6cf0]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1 mb-3">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Set New Password
        </h4>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          Create a secure password with at least 8 characters for{" "}
          <span className="font-semibold text-slate-700">{email}</span>
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-3.5 sm:space-y-4">
        {/* New Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="newPassword"
            className="block text-xs font-semibold text-slate-700"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password (min. 8 characters)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className={`auth-input w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "auth-input-error border-red-400"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-red-500 text-[11px] pl-1 font-medium">
              {formik.errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-slate-700"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={`auth-input w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "auth-input-error border-red-400"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-[11px] pl-1 font-medium">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#1a6cf0] to-[#2575fc] hover:from-[#155bd9] hover:to-[#1a6cf0] shadow-md shadow-[#1a6cf0]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-1"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating Password...
            </span>
          ) : (
            <>
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Back Link */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1a6cf0] transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Verification Code
          </button>
        </div>
      </form>
    </div>
  );
}
