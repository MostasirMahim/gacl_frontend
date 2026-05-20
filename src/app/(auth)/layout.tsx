export const metadata = {
  title: "Gagorian Club",
  description: "make your social campaigns with Gagorian Club",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
