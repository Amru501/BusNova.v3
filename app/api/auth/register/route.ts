import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { ResultSetHeader } from "mysql2/promise";
import { query } from "@/lib/db";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role, admin_type } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password and role are required" },
        { status: 400 }
      );
    }

    if (role !== "student" && role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (role === "admin") {
      const validAdminType = ["checking", "driver", "administrator"].includes(admin_type);
      if (!validAdminType) {
        return NextResponse.json(
          { error: "Admin type must be checking, driver, or administrator" },
          { status: 400 }
        );
      }
      if (!phone || String(phone).trim() === "") {
        return NextResponse.json(
          { error: "Phone is required for admin registration" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await query<{ id: number }[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const result = await query<ResultSetHeader>(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone ?? null, hashedPassword, role]
    );
    const userId = (result as ResultSetHeader).insertId;

    if (role === "admin") {
      await query<ResultSetHeader>(
        "INSERT INTO admins (user_id, role, name, phone) VALUES (?, ?, ?, ?)",
        [userId, admin_type, name, phone]
      );
    }

    const token = await createToken({
      userId: userId,
      email,
      role,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: userId, name, email, phone: phone ?? null, role },
    });
  } catch (err) {
    console.error("Register error:", err);
    const message =
      process.env.NODE_ENV === "development" && err instanceof Error
        ? err.message
        : "Registration failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
