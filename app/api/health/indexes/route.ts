import { NextResponse } from "next/server";
import { ensureDatabaseIndexes } from "@/lib/db-indexes";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    await ensureDatabaseIndexes();

    return NextResponse.json({
      status: "ok",
      message: "Database indexes created successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Database initialization failed" },
      { status: 500 },
    );
  }
}
