import { getDb } from "@/lib/db";

export async function ensureDatabaseIndexes(): Promise<void> {
  const db = await getDb();

  await db
    .collection("tenants")
    .createIndex({ name: 1 }, { name: "tenant_name_lookup" });

  await db
    .collection("users")
    .createIndex({ email: 1 }, { unique: true, name: "unique_user_email" });

  await db
    .collection("users")
    .createIndex(
      { tenantId: 1, role: 1 },
      { name: "users_by_tenant_and_role" },
    );
}
