import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2/promise";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type BusRow = {
  id: number;
  bus_number: string;
  route_id: number;
  created_by: number;
  created_at: string;
  route_name?: string;
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const buses = await query<BusRow[]>(
      `SELECT b.id, b.bus_number, b.route_id, b.created_by, b.created_at, r.name AS route_name
       FROM buses b
       JOIN routes r ON r.id = b.route_id
       ORDER BY r.name, b.bus_number`
    );
    return NextResponse.json({ buses });
  } catch (err) {
    console.error("Buses list error:", err);
    return NextResponse.json({ error: "Failed to fetch buses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const { bus_number, route_id } = body;
    if (!bus_number || route_id == null) {
      return NextResponse.json(
        { error: "bus_number and route_id are required" },
        { status: 400 }
      );
    }
    await query<ResultSetHeader>(
      "INSERT INTO buses (bus_number, route_id, created_by) VALUES (?, ?, ?)",
      [bus_number, route_id, session.userId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Add bus error:", err);
    return NextResponse.json({ error: "Failed to add bus" }, { status: 500 });
  }
}
