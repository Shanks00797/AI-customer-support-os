import { NextResponse } from "next/server";
import { MongoServerError, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getTenantsCollection } from "@/lib/models/tenants";
import { getUsersCollection } from "@/lib/models/user";
import clientPromise from "@/lib/mongodb";
import { signupSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const result = signupSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid registration details." },
      { status: 400 },
    );
  }

  const { name, companyName, email, password } = result.data;

  try {
    const client = await clientPromise;
    const tenants = await getTenantsCollection();
    const users = await getUsersCollection();

    const tenantId = new ObjectId();
    const userId = new ObjectId();
    const now = new Date();

    const passwordHash = await bcrypt.hash(password, 12);
    const normalizedName = companyName.toLowerCase();

    const tenant = {
      _id: tenantId,
      name: companyName,
      normalizedName,
      createdAt: now,
      updatedAt: now,
    };

    const user = {
      _id: userId,
      tenantId,
      name,
      email,
      passwordHash,
      role: "admin" as const,
      createdAt: now,
      updatedAt: now,
    };

    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await tenants.insertOne(tenant, { session });
        await users.insertOne(user, { session });
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json(
      {
        message: "Company registered successfully.",
        tenant: {
          id: tenantId.toHexString(),
          name: companyName,
        },
        user: {
          id: userId.toHexString(),
          name,
          email,
          role: "admin",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        {
          error:
            "Registration could not be completed. The email or company name may already be registered.",
        },
        { status: 409 },
      );
    }

    console.error("Tenant registration failed.");

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
