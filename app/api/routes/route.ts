import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2/promise";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type RouteRow = {
  id: number;
  name: string;
  daily_price: number;
  weekly_price: number;
  created_by: number;
  created_at: string;
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const routes = await query<RouteRow[]>(
      "SELECT id, name, daily_price, weekly_price, created_by, created_at FROM routes ORDER BY name"
    );
    return NextResponse.json({ routes });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { name, daily_price, weekly_price } = body;
    if (!name || daily_price == null || weekly_price == null) {
      return NextResponse.json(
        { error: "name, daily_price and weekly_price are required" },
        { status: 400 }
      );
    }
    const dp = Number(daily_price);
    const wp = Number(weekly_price);
    if (Number.isNaN(dp) || Number.isNaN(wp) || dp < 0 || wp < 0) {
      return NextResponse.json(
        { error: "Prices must be non-negative numbers" },
        { status: 400 }
      );
    }
    await query<ResultSetHeader>(
      "INSERT INTO routes (name, daily_price, weekly_price, created_by) VALUES (?, ?, ?, ?)",
      [name, dp, wp, session.userId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add route" }, { status: 500 });
  }
}
