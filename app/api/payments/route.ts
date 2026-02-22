import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2/promise";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type PaymentRow = {
  id: number;
  pass_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: "success" | "failed";
  created_at: string;
  pass_type?: string;
  route_name?: string;
  user_name?: string;
};

function randomTransactionId(): string {
  return "TXN_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const payments = await query<PaymentRow[]>(
      `SELECT py.id, py.pass_id, py.amount, py.payment_method, py.transaction_id, py.status, py.created_at,
       p.pass_type, r.name AS route_name, u.name AS user_name
       FROM payments py
       JOIN passes p ON p.id = py.pass_id
       JOIN routes r ON r.id = p.route_id
       JOIN users u ON u.id = p.user_id
       ORDER BY py.created_at DESC`
    );
    return NextResponse.json({ payments });
  } catch (err) {
    console.error("Payments list error:", err);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { pass_id, payment_method } = body;
    if (!pass_id || !payment_method) {
      return NextResponse.json(
        { error: "pass_id and payment_method are required" },
        { status: 400 }
      );
    }

    const passes = await query<{ id: number; user_id: number; amount: number }[]>(
      "SELECT id, user_id, amount FROM passes WHERE id = ? AND user_id = ?",
      [pass_id, session.userId]
    );
    if (passes.length === 0) {
      return NextResponse.json({ error: "Pass not found" }, { status: 404 });
    }
    const pass = passes[0];
    const transaction_id = randomTransactionId();

    await query<ResultSetHeader>(
      "INSERT INTO payments (pass_id, amount, payment_method, transaction_id, status) VALUES (?, ?, ?, ?, 'success')",
      [pass_id, pass.amount, payment_method, transaction_id]
    );
    await query(
      "UPDATE passes SET payment_status = 'paid' WHERE id = ?",
      [pass_id]
    );

    return NextResponse.json({
      success: true,
      transaction_id,
      redirect: "/student",
    });
  } catch (err) {
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
