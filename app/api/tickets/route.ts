import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireUser } from "@/lib/auth/permissions";
import { getTicketsCollection } from "@/lib/models/ticket";
import { createTicketSchema } from "@/lib/validators/ticket";

function handleApiError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  console.error("Tickets API error:", error);

  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 },
  );
}

export async function GET() {
  try {
    const user = await requireUser();

    if (!ObjectId.isValid(user.tenantId)) {
      return NextResponse.json(
        { error: "Invalid tenant identity" },
        { status: 403 },
      );
    }

    const tenantId = new ObjectId(user.tenantId);
    const ticketsCollection = await getTicketsCollection();

    const tickets = await ticketsCollection
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const serializedTickets = tickets.map((ticket) => ({
      ...ticket,
      _id: ticket._id.toHexString(),
      tenantId: ticket.tenantId.toHexString(),
      assignedAgentId: ticket.assignedAgentId?.toHexString() ?? null,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    }));

    return NextResponse.json({ tickets: serializedTickets });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!ObjectId.isValid(user.tenantId)) {
      return NextResponse.json(
        { error: "Invalid tenant identity" },
        { status: 403 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validation = createTicketSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid ticket data",
          details: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const now = new Date();

    const ticket = {
      _id: new ObjectId(),
      tenantId: new ObjectId(user.tenantId),
      customerName: validation.data.customerName,
      customerEmail: validation.data.customerEmail,
      subject: validation.data.subject,
      message: validation.data.message,
      status: "open" as const,
      assignedAgentId: null,
      createdAt: now,
      updatedAt: now,
    };

    const ticketsCollection = await getTicketsCollection();
    await ticketsCollection.insertOne(ticket);

    return NextResponse.json(
      {
        ticket: {
          ...ticket,
          _id: ticket._id.toHexString(),
          tenantId: ticket.tenantId.toHexString(),
          assignedAgentId: null,
          createdAt: ticket.createdAt.toISOString(),
          updatedAt: ticket.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
