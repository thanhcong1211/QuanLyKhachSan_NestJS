import AdminLayout from "@/layouts/AdminLayout";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
