"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import ShinyText from "@/components/ShinyText";

type Pass = {
  id: number;
  route_id: number;
  pass_type: string;
  amount: number;
  payment_status: string;
  approval_status: string;
  is_active: boolean;
  created_at: string;
  route_name: string;
};

function statusLabel(p: Pass) {
  if (p.is_active) return "Active";
  if (p.payment_status === "pending" && p.approval_status === "pending") return "Payment Pending";
  if (p.payment_status === "paid" && p.approval_status === "pending") return "Awaiting Approval";
  if (p.approval_status === "rejected") return "Rejected";
  if (p.payment_status === "paid" && p.approval_status === "approved") return "Active";
  return `${p.payment_status} / ${p.approval_status}`;
}

function statusColor(p: Pass) {
  if (p.is_active) return "text-emerald-400";
  if (p.payment_status === "pending" && p.approval_status === "pending") return "text-amber-400";
  if (p.approval_status === "rejected") return "text-red-400";
  return "text-zinc-400";
}

export default function MyPassPage() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/passes")
      .then((res) => res.json())
      .then((data) => {
        if (data.passes) setPasses(data.passes);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingPayment = passes.find(
    (p) => p.payment_status === "pending" && p.approval_status === "pending"
  );

  return (
    <div className="space-y-6">
      <Link href="/student" className="inline-block text-zinc-400 hover:text-white">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold">
        <ShinyText
          text="My Pass"
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
        ) : passes.length === 0 ? (
          <Card className="w-full max-w-md">
            <CardContent className="py-8 text-center">
              <p className="text-zinc-400">You don&apos;t have any passes yet.</p>
              <Link
                href="/student/request"
                className="mt-4 inline-block text-emerald-400 hover:underline"
              >
                Request a pass →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="flex w-full max-w-lg flex-col gap-4">
            {passes.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`text-sm font-medium ${statusColor(p)}`}>
                      {statusLabel(p)}
                    </span>
                    {p.payment_status === "pending" && p.approval_status === "pending" && (
                      <Link
                        href={`/student/pay/${p.id}`}
                        className="text-sm font-medium text-emerald-400 hover:underline"
                      >
                        Pay now
                      </Link>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-white">{p.route_name}</p>
                  <p className="mt-1 text-zinc-400">
                    {p.pass_type.charAt(0).toUpperCase() + p.pass_type.slice(1)} pass · ₹{p.amount}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {pendingPayment && (
        <div className="flex justify-center">
          <Link href={`/student/pay/${pendingPayment.id}`}>
            <span className="text-sm text-amber-400 hover:underline">
              Pay for {pendingPayment.route_name} (₹{pendingPayment.amount}) →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
