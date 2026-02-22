"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Route = { id: number; name: string; daily_price: number; weekly_price: number };

export default function AddRoutePage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [name, setName] = useState("");
  const [dailyPrice, setDailyPrice] = useState("");
  const [weeklyPrice, setWeeklyPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function loadRoutes() {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        if (data.routes) setRoutes(data.routes);
      });
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          daily_price: Number(dailyPrice),
          weekly_price: Number(weeklyPrice),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add route");
        return;
      }
      setSuccess(true);
      setName("");
      setDailyPrice("");
      setWeeklyPrice("");
      loadRoutes();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-block text-zinc-400 hover:text-white">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white">Add Route</h1>

      <Card className="max-w-md">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">New route with prices</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Route name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Central Station — North Campus"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Daily price (₹)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
                placeholder="20"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Weekly price (₹)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={weeklyPrice}
                onChange={(e) => setWeeklyPrice(e.target.value)}
                placeholder="100"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-emerald-400">Route added successfully.</p>
            )}
            <Button type="submit" className="w-full" isLoading={loading}>
              Add Route
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Added routes</h2>
        </CardHeader>
        <CardContent>
          {routes.length === 0 ? (
            <p className="text-zinc-400">No routes yet. Add one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400">
                    <th className="pb-3 pr-6 font-medium">Route</th>
                    <th className="pb-3 pr-6 font-medium">Daily</th>
                    <th className="pb-3 font-medium">Weekly</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.id} className="border-b border-white/10/50">
                      <td className="py-3 pr-6 font-medium text-white">{r.name}</td>
                      <td className="py-3 pr-6 text-zinc-400">₹{r.daily_price}</td>
                      <td className="py-3 text-zinc-400">₹{r.weekly_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
