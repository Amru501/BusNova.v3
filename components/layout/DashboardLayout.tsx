"use client";

import { useRouter, usePathname } from "next/navigation";
import PillNav, { type PillNavItem } from "@/components/PillNav";

type NavItem = { href: string; label: string };

export function DashboardLayout({
  navItems,
  children,
  role,
  logo = "/next.svg",
}: {
  navItems: NavItem[];
  children: React.ReactNode;
  role: "student" | "admin";
  logo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const items: PillNavItem[] = [
    ...navItems,
    { label: "Logout", href: "#", isButton: true },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 w-full">
        <div className="flex min-h-[4rem] w-full items-center px-4 pt-4">
          <PillNav
            logo={logo}
            logoAlt={role === "admin" ? "Admin" : "Student"}
            items={items}
            activeHref={pathname}
            baseColor="#000"
            pillColor="#fff"
            pillTextColor="#000"
            hoveredPillTextColor="#fff"
            onLogout={handleLogout}
            initialLoadAnimation={true}
          />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
