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
    <div className="min-h-screen min-h-[100dvh] flex flex-col">
      <header className="sticky top-0 z-10 w-full shrink-0 bg-[var(--overlay)]/80 backdrop-blur-sm">
        <div className="flex min-h-[4rem] w-full items-center px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
          <PillNav
            logo={logo}
            logoAlt={role === "admin" ? "Admin" : "Student"}
            items={items}
            activeHref={pathname}
            baseColor="rgba(245, 158, 11, 0.9)"
            pillColor="rgba(24, 24, 27, 0.85)"
            pillTextColor="#fff"
            hoveredPillTextColor="#000"
            onLogout={handleLogout}
            initialLoadAnimation={true}
          />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
