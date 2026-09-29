"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useState,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { useForgetPassStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function OtpStep() {
  const { email, otp: OTP, setOtp: SET_OTP, setToken } = useForgetPassStore();
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(() =>
    OTP ? OTP.split("").slice(0, 4) : Array(4).fill("")
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/forget-password/email");
    }
  }, [email, router]);

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{4}$/, "OTP must be 4 digits")
      .required("OTP is required"),
  });

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: number }) => {
      const res = await axiosInstance.post("/api/account/v1/verify_otp/", {
        email,
        otp,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        setToken(data?.token);
        toast.success("OTP verified successfully.");
        router.push("/forget-password/reset");
      }
    },
    onError: (error: any) => {
      console.error("Error verifying OTP:", error);
      const { message, errors, details } = error?.response?.data || {};

      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "Verification Failed");
      } else {
        toast.error(details || message || "Verification Failed");
      }
      formik.resetForm();
    },
  });

  const formik = useFormik({
    initialValues: {
      otp: OTP || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.otp.length === 4) {
        SET_OTP(values.otp);
        verifyOtp({ email, otp: parseInt(values.otp) });
      }
    },
  });

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      formik.setFieldValue("otp", newOtp.join(""));
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    formik.resetForm();
    SET_OTP("");
    setToken("");
    router.push("/forget-password/email");
  };

  useEffect(() => {
    if (OTP) {
      const sliced = OTP.slice(0, 4).split("");
      setOtp(sliced);
      formik.setFieldValue("otp", OTP);
    }
  }, [OTP]);

  const handleResend = () => {
    if (email) {
      axiosInstance
        .post("/api/account/v1/forget_password/", { email })
        .then(() => toast.success("A new verification code has been sent."))
        .catch(() => toast.error("Could not resend code. Please try again."));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 mb-4">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Enter Verification Code
        </h4>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          Please enter the 4-digit code sent to{" "}
          <span className="font-semibold text-slate-800">{email}</span>
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-2.5 sm:gap-3.5 my-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className="auth-input w-12 h-13 sm:w-14 sm:h-14 text-center text-xl font-bold text-slate-900 border border-slate-200 rounded-xl bg-white shadow-sm transition-colors duration-150"
            />
          ))}
        </div>

        {formik.touched.otp && formik.errors.otp && (
          <p className="text-red-500 text-xs text-center font-medium">
            {formik.errors.otp}
          </p>
        )}

        <div className="text-xs text-slate-500 text-center pt-1">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-[#1a6cf0] font-semibold hover:underline cursor-pointer"
          >
            Resend Code
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#1a6cf0] to-[#2575fc] hover:from-[#155bd9] hover:to-[#1a6cf0] shadow-md shadow-[#1a6cf0]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-1"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1a6cf0] transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change Email Address
          </button>
        </div>
      </form>
    </div>
  );
}
