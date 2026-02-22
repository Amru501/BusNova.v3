"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Route = { id: number; name: string; daily_price: number; weekly_price: number };
type Bus = { id: number; bus_number: string; route_id: number; route_name: string };

export default function AddBusPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busNumber, setBusNumber] = useState("");
  const [routeId, setRouteId] = useState("");
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

  function loadBuses() {
    fetch("/api/buses")
      .then((res) => res.json())
      .then((data) => {
        if (data.buses) setBuses(data.buses);
      });
  }

  useEffect(() => {
    loadRoutes();
    loadBuses();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus_number: busNumber, route_id: Number(routeId) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add bus");
        return;
      }
      setSuccess(true);
      setBusNumber("");
      setRouteId(routes[0] ? String(routes[0].id) : "");
      loadBuses();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-block text-zinc-400 hover:text-white">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white">Add Bus</h1>

      <Card className="max-w-md">
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Register bus on a route</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Route
              </label>
              <Select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                required
              >
                <option value="">Choose a route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Bus number
              </label>
              <Input
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="e.g. B101"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-emerald-400">Bus added successfully.</p>
            )}
            <Button type="submit" className="w-full" isLoading={loading}>
              Add Bus
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Added buses</h2>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <p className="text-zinc-400">No buses yet. Add one above.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {buses.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                  <span className="font-medium text-white">Bus {b.bus_number}</span>
                  <span className="text-sm text-zinc-400">{b.route_name}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
