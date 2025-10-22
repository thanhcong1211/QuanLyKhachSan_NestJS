// Admin pages - redirect to App Router
export default function AdminIndexPage() {
  if (typeof window !== "undefined") {
    window.location.href = "/(admin)/dashboard";
  }
  return null;
}
