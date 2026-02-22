import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/routes", label: "Add Route" },
  { href: "/admin/buses", label: "Add Bus" },
  { href: "/admin/passes", label: "View All Passes" },
  { href: "/admin/payments", label: "View All Payments" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={navItems} role="admin">
      {children}
    </DashboardLayout>
  );
}
