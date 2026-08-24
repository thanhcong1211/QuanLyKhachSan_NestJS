import AuthLayout from "@/layouts/AuthLayout";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
