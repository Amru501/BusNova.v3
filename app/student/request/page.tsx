"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

type Route = {
  id: number;
  name: string;
  daily_price: number;
  weekly_price: number;
};

export default function RequestPassPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeId, setRouteId] = useState("");
  const [routeOpen, setRouteOpen] = useState(false);
  const routeRef = useRef<HTMLDivElement>(null);

  const [passType, setPassType] = useState<"daily" | "weekly">("daily");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        if (data.routes) setRoutes(data.routes);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (routeRef.current && !routeRef.current.contains(event.target as Node)) {
        setRouteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedRoute = routes.find((r) => r.id === Number(routeId));
  const amount = selectedRoute
    ? passType === "daily"
      ? selectedRoute.daily_price
      : selectedRoute.weekly_price
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!routeId) {
      setError("Please select a route");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route_id: Number(routeId), pass_type: passType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to request pass");
        return;
      }
      if (data.pass_id) {
        router.push(`/student/pay/${data.pass_id}`);
      } else {
        router.push("/student");
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/student" className="inline-block text-zinc-400 hover:text-white">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white">Request New Pass</h1>

      <Card className="max-w-md">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Select route and pass type</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div ref={routeRef} className="relative">
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Route
              </label>
              <input type="hidden" name="route_id" value={routeId} required readOnly />
              <button
                type="button"
                onClick={() => setRouteOpen((o) => !o)}
                className="w-full rounded-lg border border-white/15 bg-zinc-900/70 px-4 py-2.5 text-left text-zinc-100 backdrop-blur-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {selectedRoute ? selectedRoute.name : "Choose a route"}
              </button>
              {routeOpen && (
                <div className="absolute top-full left-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-white/15 bg-zinc-900/90 shadow-xl backdrop-blur-md">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm">
                      <tr className="border-b border-white/10 text-zinc-400">
                        <th className="px-4 py-2.5 font-medium">Route</th>
                        <th className="px-4 py-2.5 font-medium">Daily</th>
                        <th className="px-4 py-2.5 font-medium">Weekly</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => {
                            setRouteId(String(r.id));
                            setRouteOpen(false);
                          }}
                          className={`cursor-pointer border-b border-white/5 last:border-0 ${
                            r.id === Number(routeId) ? "bg-white/10" : "hover:bg-white/5"
                          }`}
                        >
                          <td className="px-4 py-2.5 font-medium text-white">{r.name}</td>
                          <td className="px-4 py-2.5 text-zinc-400">₹{r.daily_price}</td>
                          <td className="px-4 py-2.5 text-zinc-400">₹{r.weekly_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Pass type
              </label>
              <Select
                value={passType}
                onChange={(e) => setPassType(e.target.value as "daily" | "weekly")}
              >
                <option value="daily">
                  Daily {selectedRoute && `— ₹${selectedRoute.daily_price}`}
                </option>
                <option value="weekly">
                  Weekly {selectedRoute && `— ₹${selectedRoute.weekly_price}`}
                </option>
              </Select>
            </div>
            <p className="text-sm text-zinc-500">
              Amount: <span className="font-medium text-white">₹{amount}</span>
            </p>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full" isLoading={loading}>
              Request Pass
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
