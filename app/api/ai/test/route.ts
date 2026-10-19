import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/permissions";
import { gemini } from "@/lib/ai/gemini";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireUser();

    const response = await gemini.models.generateContent({
      model: "gemini-3.8-flash",
      contents: "Reply with exactly: Gemini connection successful.",
    });

    return NextResponse.json({
      success: true,
      message: response.text ?? "",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Do not expose API keys or raw provider errors.
    console.error("Gemini connection test failed.", error);

    return NextResponse.json(
      { error: "Gemini connection test failed. Check server configuration." },
      { status: 500 },
    );
  }
}
