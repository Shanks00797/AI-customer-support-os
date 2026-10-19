import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export type TicketStatus = "open" | "drafted" | "sent" | "escalated";

export interface Ticket {
  _id: ObjectId;
  tenantId: ObjectId;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: TicketStatus;
  assignedAgentId: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTicketsCollection(): Promise<Collection<Ticket>> {
  const db = await getDb();

  return db.collection<Ticket>("tickets");
}
