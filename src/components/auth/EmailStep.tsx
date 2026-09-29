"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useForgetPassStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

function EmailStep() {
  const router = useRouter();
  const { email, setEmail, reset } = useForgetPassStore();

  const { mutate: sentOtp, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const res = await axiosInstance.post("/api/account/v1/forget_password/", {
        email: email,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        toast.success(data.message || "OTP sent successfully.");
        router.push("/forget-password/otp");
        formik.resetForm();
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      console.error("Error in sending OTP", error?.response);
      const { message, errors, details } = error?.response?.data || {};

      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : (messages as string)
          );
        });
      } else {
        toast.error(details || message || "An error occurred. Please try again.");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: email || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.email) {
        setEmail(values.email);
        sentOtp(values.email);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    reset();
    router.push("/login");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 mb-4">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Forgot Password?
        </h4>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          Enter your registered email address and we will send a 4-digit verification code to reset your password.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700">
            Registered Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your registered email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`auth-input w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 bg-white transition-colors duration-150 ${
                formik.touched.email && formik.errors.email
                  ? "auth-input-error border-red-400"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-[11px] pl-1 font-medium">{formik.errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#1a6cf0] to-[#2575fc] hover:from-[#155bd9] hover:to-[#1a6cf0] shadow-md shadow-[#1a6cf0]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-1"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending Code...
            </span>
          ) : (
            <>
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1a6cf0] transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailStep;
