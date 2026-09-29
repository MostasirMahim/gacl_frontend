import { redirect } from "next/navigation";

export default function ForgetPasswordRootPage() {
  redirect("/forget-password/email");
}
