import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export type UserRole = "admin" | "agent";

export interface User {
  _id: ObjectId;
  tenantId: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDb();

  return db.collection<User>("users");
}
