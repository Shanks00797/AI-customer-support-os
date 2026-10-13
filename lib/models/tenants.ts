import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export interface Tenant {
  _id: ObjectId;
  name: string;
  normalizedName: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getTenantsCollection(): Promise<Collection<Tenant>> {
  const db = await getDb();

  return db.collection<Tenant>("tenants");
}
