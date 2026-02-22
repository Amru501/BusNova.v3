"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import ShinyText from "@/components/ShinyText";

type Driver = { id: number; name: string; phone: string | null };

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/drivers")
      .then((res) => res.json())
      .then((data) => {
        if (data.drivers) setDrivers(data.drivers);
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
          text="Drivers"
          color="#b5b5b5"
          shineColor="#ffffff"
          speed={2.5}
          spread={120}
          yoyo
          pauseOnHover
          className="text-2xl font-bold"
        />
      </h1>

      <div className="flex min-h-[40vh] flex-col items-center justify-center">
        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : drivers.length === 0 ? (
          <Card className="w-full max-w-md">
            <CardContent className="py-8 text-center">
              <p className="text-zinc-400">No drivers listed yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            {drivers.map((d) => (
              <Card key={d.id}>
                <CardContent className="p-6">
                  <p className="text-zinc-400">
                    Name: <span className="font-semibold text-white">{d.name}</span>
                  </p>
                  <p className="mt-2 text-zinc-400">
                    Phone:{" "}
                    {d.phone ? (
                      <a href={`tel:${d.phone}`} className="font-semibold text-white hover:text-emerald-400">
                        {d.phone}
                      </a>
                    ) : (
                      <span className="text-white">—</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
