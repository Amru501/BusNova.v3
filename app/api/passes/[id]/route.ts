import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const passId = parseInt(id, 10);
    if (Number.isNaN(passId)) {
      return NextResponse.json({ error: "Invalid pass id" }, { status: 400 });
    }

    const body = await _request.json();
    const { action } = body; // 'approve' | 'reject'
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "action must be approve or reject" },
        { status: 400 }
      );
    }

    const approval_status = action === "approve" ? "approved" : "rejected";
    const is_active = action === "approve" ? 1 : 0;

    await query(
      `UPDATE passes SET approval_status = ?, is_active = ?,
       active_at = IF(? = 1, CURRENT_TIMESTAMP, active_at),
       expires_at = IF(? = 1, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 MONTH), expires_at)
       WHERE id = ?`,
      [approval_status, is_active, is_active, is_active, passId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update pass" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const passId = parseInt(id, 10);
    if (Number.isNaN(passId)) {
      return NextResponse.json({ error: "Invalid pass id" }, { status: 400 });
    }
    await query("DELETE FROM payments WHERE pass_id = ?", [passId]);
    await query("DELETE FROM passes WHERE id = ?", [passId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete pass" }, { status: 500 });
  }
}
