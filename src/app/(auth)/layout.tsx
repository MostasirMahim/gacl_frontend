import { BRAND_CONFIG } from "@/config/brand";

export const metadata = {
  title: BRAND_CONFIG.loginTitle,
  description: BRAND_CONFIG.description,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
