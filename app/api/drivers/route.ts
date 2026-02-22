import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type DriverRow = {
  id: number;
  name: string;
  phone: string | null;
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const drivers = await query<DriverRow[]>(
      "SELECT a.id, a.name, a.phone FROM admins a WHERE a.role = 'driver' ORDER BY a.name"
    );
    return NextResponse.json({ drivers });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}
