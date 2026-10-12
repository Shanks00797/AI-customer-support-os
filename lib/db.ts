import clientPromise from "@/lib/mongodb";

export async function getDb() {
  const databaseName = process.env.MONGODB_DB;

  if (!databaseName) {
    throw new Error("MONGODB_DB is not configured.");
  }

  const client = await clientPromise;

  return client.db(databaseName);
}
