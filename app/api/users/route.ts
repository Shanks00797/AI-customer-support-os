import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { MongoServerError, ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/auth/permissions";
import { getUsersCollection } from "@/lib/models/user";
import { createAgentSchema } from "@/lib/validators/users";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    const body: unknown = await request.json();
    const result = createAgentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid agent details." },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(admin.tenantId)) {
      return NextResponse.json(
        { error: "Invalid authenticated tenant." },
        { status: 403 },
      );
    }

    const { name, email, password } = result.data;
    const users = await getUsersCollection();

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const agent = {
      _id: new ObjectId(),
      tenantId: new ObjectId(admin.tenantId),
      name,
      email,
      passwordHash,
      role: "agent" as const,
      createdAt: now,
      updatedAt: now,
    };

    await users.insertOne(agent);

    return NextResponse.json(
      {
        message: "Agent created successfully.",
        user: {
          id: agent._id.toHexString(),
          name: agent.name,
          email: agent.email,
          role: agent.role,
          tenantId: agent.tenantId.toHexString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    console.error("Agent creation failed.");

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
