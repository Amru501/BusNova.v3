"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

type Payment = {
  id: number;
  pass_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  pass_type?: string;
  route_name?: string;
  user_name?: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.payments) setPayments(data.payments);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-zinc-400 hover:text-white">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">All Payments</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Payment history</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="text-zinc-400">No payments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-zinc-400">
                    <th className="pb-3 pr-4">ID</th>
                    <th className="pb-3 pr-4">Pass</th>
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Method</th>
                    <th className="pb-3 pr-4">Transaction ID</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((py) => (
                    <tr key={py.id} className="border-b border-zinc-700/50">
                      <td className="py-3 pr-4 text-zinc-300">{py.id}</td>
                      <td className="py-3 pr-4 text-zinc-300">
                        #{py.pass_id} {py.route_name && `· ${py.route_name}`}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">
                        {py.user_name ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">₹{py.amount}</td>
                      <td className="py-3 pr-4 text-zinc-300">
                        {py.payment_method}
                      </td>
                      <td className="py-3 pr-4 font-mono text-zinc-400">
                        {py.transaction_id}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            py.status === "success"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {py.status}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-500">
                        {new Date(py.created_at).toLocaleString()}
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
