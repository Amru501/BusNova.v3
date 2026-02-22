"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import ShinyText from "@/components/ShinyText";

type Bus = { id: number; bus_number: string; route_id: number; route_name: string };

export default function ViewBusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/buses")
      .then((res) => res.json())
      .then((data) => {
        if (data.buses) setBuses(data.buses);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <Link href="/student" className="inline-block text-zinc-400 hover:text-white">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold">
        <ShinyText
          text="All Buses"
          color="#b5b5b5"
          shineColor="#ffffff"
          speed={2.5}
          spread={120}
          yoyo
          pauseOnHover
          className="text-2xl font-bold"
        />
      </h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Available buses</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : buses.length === 0 ? (
            <p className="text-zinc-400">No buses found.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {buses.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                  <div>
                    <span className="font-medium text-white">Bus {b.bus_number}</span>
                    <span className="ml-2 text-zinc-400">— {b.route_name}</span>
                  </div>
                  <Link
                    href="/student/request"
                    className="text-sm text-emerald-400 hover:underline"
                  >
                    Request pass
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
