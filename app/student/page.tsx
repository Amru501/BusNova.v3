"use client";

import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import ShinyText from "@/components/ShinyText";

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        <ShinyText
          text="My Dashboard"
          color="#b5b5b5"
          shineColor="#ffffff"
          speed={2.5}
          spread={120}
          yoyo
          pauseOnHover
          className="text-2xl font-bold"
        />
      </h1>

      <div className="dashboard-blocks">
        <div className="dashboard-twine" aria-hidden />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          <Link href="/student/my-pass" className="block">
            <Card className="dashboard-card h-full transition hover:border-emerald-500/40">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">View My Pass</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  See your pass status, type and route.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/request" className="block">
            <Card className="dashboard-card h-full transition hover:border-emerald-500/40">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Request for Pass</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  Choose a route and pass type. Price is set per route by admin.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/buses" className="block">
            <Card className="dashboard-card h-full transition hover:border-emerald-500/40">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">View All Buses</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  See all available buses and their routes.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/drivers" className="block">
            <Card className="dashboard-card h-full transition hover:border-emerald-500/40">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">View Drivers</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  See driver names and contact numbers.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
