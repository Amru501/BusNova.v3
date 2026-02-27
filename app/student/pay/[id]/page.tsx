"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ShinyText from "@/components/ShinyText";
import { Select } from "@/components/ui/Select";

type Pass = {
  id: number;
  route_id: number;
  pass_type: string;
  amount: number;
  payment_status: string;
  route_name: string;
};

const PAYMENT_METHODS = ["Card", "UPI", "Net Banking", "Wallet"];

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [pass, setPass] = useState<Pass | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/passes")
      .then((res) => res.json())
      .then((data) => {
        const p = data.passes?.find((x: { id: number }) => x.id === parseInt(id, 10));
        setPass(p ?? null);
      });
  }, [id]);

  async function handlePay() {
    if (!pass) return;
    if (pass.payment_status === "paid") {
      router.push("/student");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass_id: pass.id, payment_method: paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Payment failed");
        return;
      }
      router.push("/student");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!pass) {
    return (
      <div className="space-y-6">
        <Link href="/student" className="inline-block text-zinc-400 hover:text-amber-400">
          ← Dashboard
        </Link>
        <p className="text-zinc-400">Loading pass...</p>
      </div>
    );
  }

  if (pass.payment_status === "paid") {
    return (
      <div className="space-y-6">
        <Link href="/student" className="inline-block text-zinc-400 hover:text-amber-400">
          ← Dashboard
        </Link>
        <div className="dashboard-panel">
          <div className="dashboard-panel-body py-6">
            <p className="text-amber-400">This pass is already paid.</p>
            <Link href="/student">
              <Button variant="secondary" className="mt-4">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/student" className="inline-block text-zinc-400 hover:text-amber-400">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold">
        <ShinyText
          text="Simulated Payment"
          color="#b5b5b5"
          shineColor="#ffffff"
          speed={2.5}
          spread={120}
          yoyo
          pauseOnHover
          className="text-2xl font-bold"
        />
      </h1>

      <div className="dashboard-panel max-w-md">
        <div className="dashboard-panel-header">Pay for pass</div>
        <div className="dashboard-panel-body space-y-4">
          <div className="rounded-lg border border-white/5 bg-black/15 p-4">
            <p className="text-zinc-400">{pass.route_name}</p>
            <p className="text-lg font-semibold text-white">
              {pass.pass_type} pass — ₹{pass.amount}
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Payment method
            </label>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button
            className="w-full"
            onClick={handlePay}
            isLoading={loading}
          >
            Pay ₹{pass.amount}
          </Button>
        </div>
      </div>
    </div>
  );
}
