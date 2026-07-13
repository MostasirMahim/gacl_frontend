"use client";

import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  PartyPopper,
  Mails,
  MailCheck,
  XCircle,
  ShieldAlert,
  Key,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";

const passwordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm New Password is required"),
});

export default function PortalResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<
    "landing" | "sending" | "send_failed" | "otp" | "reset" | "success"
  >("landing");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(4).fill(""));
  const [otpError, setOtpError] = useState("");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load the member's email on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/member/v1/portal/me/");
        const emails = res.data?.data?.email_address || [];
        const primaryEmailObj =
          emails.find((e: any) => e.is_primary) || emails[0];
        if (primaryEmailObj?.email) {
          setEmail(primaryEmailObj.email);
        }
      } catch (err) {
        console.error("Error loading member profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // Initiate OTP generation API request
  const initiateOtp = async () => {
    setStep("sending");
    setIsSending(true);
    setErrorMessage("");
    try {
      const response = await axiosInstance.post(
        "/api/account/v1/portal_reset_password_initiate/",
      );
      if (response.data?.status === "success") {
        setEmail(response.data.email || email);
        toast.success(
          response.data.message || "Verification code sent to your email.",
        );
        setStep("otp");
      } else {
        setErrorMessage(
          response.data?.message || "Failed to send verification code.",
        );
        setStep("send_failed");
      }
    } catch (error: any) {
      console.error("Error initiating portal password reset:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.details ||
        "Failed to send verification code.";
      setErrorMessage(msg);
      setStep("send_failed");
    } finally {
      setIsSending(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newDigits = [...otpDigits];
      newDigits[index] = value;
      setOtpDigits(newDigits);
      setOtpError("");

      // Auto-focus next input
      if (value && index < 3) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 4) {
      setOtpError("Please enter all 4 digits of the OTP.");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const response = await axiosInstance.post("/api/account/v1/verify_otp/", {
        email: email,
        otp: parseInt(fullOtp),
      });

      if (response.data?.status === "success" && response.data?.token) {
        setToken(response.data.token);
        toast.success("OTP verified successfully.");
        setStep("reset");
      } else {
        setOtpError(response.data?.message || "Invalid verification code.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.details ||
        "OTP verification failed.";
      setOtpError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset password formik
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      setIsResetting(true);
      try {
        const response = await axiosInstance.post(
          "/api/account/v1/reset_password/",
          {
            email: email,
            password: values.newPassword,
            token: token,
          },
        );

        if (response.data?.status === "success") {
          toast.success(
            response.data.message || "Password updated successfully.",
          );
          setStep("success");
        } else {
          toast.error(response.data?.message || "Failed to reset password.");
        }
      } catch (error: any) {
        console.error("Error resetting password:", error);
        const { errors, message, detail } = error?.response?.data || {};
        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            formik.setFieldError(
              field,
              Array.isArray(messages) ? messages[0] : (messages as string),
            );
          });
        }
        toast.error(detail || message || "Password reset failed.");
      } finally {
        setIsResetting(false);
      }
    },
  });

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      {/* 0. Landing Intro Step */}
      {step === "landing" && (
        <Card className="w-full max-w-sm rounded-lg shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-primary/10 border-2 border-primary/20">
              <Key className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Reset Your Password</h2>
              <p className="text-sm text-muted-foreground">
                To secure your account, we need to verify your identity. A
                verification code will be sent to your registered email address:
              </p>
              {isLoadingProfile ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : (
                <p className="inline-block text-xs font-semibold text-primary border p-1.5 px-4 rounded-full bg-primary/5 border-primary/15 mt-2">
                  {email || "No email on file"}
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/portal")}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                onClick={initiateOtp}
                disabled={isLoadingProfile || !email}
              >
                Send Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 1. Sending State */}
      {step === "sending" && (
        <Card className="w-full max-w-sm rounded-lg shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-primary/10 border-2 border-primary/20">
              <Mails className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Sending Verification Code</h2>
              <p className="text-sm text-muted-foreground">
                We are sending a 4-digit OTP to your registered email address to
                secure your request.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Send Failed State */}
      {step === "send_failed" && (
        <Card className="w-full max-w-sm rounded-lg shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-red-100 border-2 border-red-200">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-red-600">
                Failed to Send OTP
              </h2>
              <p className="text-sm text-muted-foreground">
                {errorMessage ||
                  "An unexpected error occurred while sending the email."}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/portal")}
              >
                Go Back
              </Button>
              <Button className="w-full" onClick={initiateOtp}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Enter OTP State */}
      {step === "otp" && (
        <Card className="w-full max-w-sm rounded-lg shadow-lg">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-primary/10 border-2 border-primary/20">
              <MailCheck className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Verify Verification Code</h2>
              <p className="text-sm text-muted-foreground">
                We sent a 4-digit code to:
              </p>
              <p className="inline-block text-xs font-semibold text-primary border p-1 px-3.5 rounded-full bg-primary/5 border-primary/15">
                {email}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    className="w-12 h-12 text-center text-xl font-bold border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus-visible:ring-primary"
                  />
                ))}
              </div>

              {otpError && (
                <div className="text-red-500 text-xs flex items-center justify-center gap-1.5 pl-2 pr-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Didn't get the code?{" "}
                <button
                  type="button"
                  disabled={isSending}
                  onClick={initiateOtp}
                  className="text-primary font-medium hover:underline focus:outline-none disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => setStep("landing")}
                >
                  Back
                </Button>
                <Button className="w-full" type="submit" disabled={isVerifying}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 4. Reset Password Form State */}
      {step === "reset" && (
        <Card className="w-full max-w-sm rounded-lg shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold">Set New Password</h1>
                <p className="text-xs text-muted-foreground">
                  Enter your new password below for:
                </p>
                <p className="inline-block text-xs font-semibold text-primary border p-1 px-3.5 rounded-full bg-primary/5 border-primary/15 mt-1">
                  {email}
                </p>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password
                  <span className="text-[10px] text-muted-foreground font-light ml-1">
                    (Min. 8 characters)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    className={
                      formik.touched.newPassword && formik.errors.newPassword
                        ? "border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div className="text-red-500 text-xs pl-1">
                    {formik.errors.newPassword}
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "border-red-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="text-red-500 text-xs pl-1">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => setStep("otp")}
                >
                  Back
                </Button>
                <Button className="w-full" type="submit" disabled={isResetting}>
                  {isResetting ? "Resetting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 5. Success State */}
      {step === "success" && (
        <Card className="w-full max-w-sm rounded-lg shadow-lg">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-primary/10 border-2 border-primary/20 animate-bounce">
              <PartyPopper className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Congratulations!</h2>
              <p className="text-sm text-muted-foreground">
                Your password has been successfully updated.
              </p>
            </div>
            <div className="pt-2">
              <Button className="w-full" onClick={() => router.push("/portal")}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
