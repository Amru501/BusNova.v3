import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2/promise";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type PassRow = {
  id: number;
  user_id: number;
  route_id: number;
  pass_type: "daily" | "weekly";
  amount: number;
  payment_status: "pending" | "paid" | "failed";
  approval_status: "pending" | "approved" | "rejected";
  is_active: boolean;
  created_at: string;
  route_name?: string;
  user_name?: string;
  user_email?: string;
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "student") {
      const passes = await query<PassRow[]>(
        `SELECT p.id, p.user_id, p.route_id, p.pass_type, p.amount, p.payment_status, p.approval_status, p.is_active, p.created_at,
         r.name AS route_name
         FROM passes p
         JOIN routes r ON r.id = p.route_id
         WHERE p.user_id = ?
         ORDER BY p.created_at DESC`,
        [session.userId]
      );
      return NextResponse.json({ passes });
    }

    const passes = await query<PassRow[]>(
      `SELECT p.id, p.user_id, p.route_id, p.pass_type, p.amount, p.payment_status, p.approval_status, p.is_active, p.created_at,
       r.name AS route_name, u.name AS user_name, u.email AS user_email
       FROM passes p
       JOIN routes r ON r.id = p.route_id
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC`
    );
    return NextResponse.json({ passes });
  } catch (err) {
    console.error("Passes list error:", err);
    return NextResponse.json({ error: "Failed to fetch passes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { route_id, pass_type } = body;
    if (!route_id || !pass_type) {
      return NextResponse.json(
        { error: "route_id and pass_type are required" },
        { status: 400 }
      );
    }
    const passType: "daily" | "weekly" | null =
      pass_type === "daily" || pass_type === "weekly" ? pass_type : null;
    if (!passType) {
      return NextResponse.json(
        { error: "pass_type must be daily or weekly" },
        { status: 400 }
      );
    }
    const routes = await query<{ daily_price: number; weekly_price: number }[]>(
      "SELECT daily_price, weekly_price FROM routes WHERE id = ?",
      [route_id]
    );
    if (routes.length === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }
    const amount = passType === "daily" ? routes[0].daily_price : routes[0].weekly_price;
    const result = await query<ResultSetHeader>(
      `INSERT INTO passes (user_id, route_id, pass_type, amount, payment_status, approval_status, is_active)
       VALUES (?, ?, ?, ?, 'pending', 'pending', FALSE)`,
      [session.userId, route_id, passType, amount]
    );
    const passId = (result as ResultSetHeader).insertId;
    return NextResponse.json({ success: true, pass_id: passId });
  } catch (err) {
    console.error("Create pass error:", err);
    return NextResponse.json({ error: "Failed to create pass" }, { status: 500 });
  }
}
