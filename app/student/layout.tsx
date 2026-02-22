import { DashboardLayout } from "@/components/layout/DashboardLayout";

const navItems = [
  { href: "/student", label: "Dashboard" },
  { href: "/student/my-pass", label: "View My Pass" },
  { href: "/student/request", label: "Request New Pass" },
  { href: "/student/buses", label: "View All Buses" },
  { href: "/student/drivers", label: "View Drivers" },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={navItems} role="student">
      {children}
    </DashboardLayout>
  );
}
