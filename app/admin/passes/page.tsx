"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Pass = {
  id: number;
  user_id: number;
  route_id: number;
  pass_type: string;
  amount: number;
  payment_status: string;
  approval_status: string;
  is_active: boolean;
  created_at: string;
  route_name: string;
  user_name: string;
  user_email: string;
};

export default function AdminPassesPage() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);

  function loadPasses() {
    fetch("/api/passes")
      .then((res) => res.json())
      .then((data) => {
        if (data.passes) setPasses(data.passes);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPasses();
  }, []);

  async function handleAction(passId: number, action: "approve" | "reject") {
    const res = await fetch(`/api/passes/${passId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) loadPasses();
  }

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-block text-zinc-400 hover:text-white">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white">All Passes</h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Pass requests</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : passes.length === 0 ? (
            <p className="text-zinc-400">No passes yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Route</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 pr-4">Approval</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passes.map((p) => (
                    <tr key={p.id} className="border-b border-white/10/50">
                      <td className="py-3 pr-4 text-zinc-300">{p.id}</td>
                      <td className="py-3 pr-4 text-zinc-300">
                        {p.user_name ?? p.user_email}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">
                        {p.route_name}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">{p.pass_type}</td>
                      <td className="py-3 pr-4 text-zinc-300">₹{p.amount}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            p.payment_status === "paid"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            p.approval_status === "approved"
                              ? "text-emerald-400"
                              : p.approval_status === "rejected"
                                ? "text-red-400"
                                : "text-amber-400"
                          }
                        >
                          {p.approval_status}
                        </span>
                      </td>
                      <td className="py-3">
                        {p.payment_status === "paid" &&
                          p.approval_status === "pending" && (
                            <span className="flex gap-2">
                              <Button
                                variant="ghost"
                                className="text-emerald-400"
                                onClick={() => handleAction(p.id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-red-400"
                                onClick={() => handleAction(p.id, "reject")}
                              >
                                Reject
                              </Button>
                            </span>
                          )}
                      </td>
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
