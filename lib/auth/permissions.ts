
import "server-only";

import { auth } from "@/auth";

export type AppRole = "admin" | "agent";

export type AuthenticatedUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: AppRole;
  tenantId: string;
};

/**
 * Returns the authenticated user or throws if no valid session exists.
 * Use this only in server-side code.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const session = await auth();
  const user = session?.user;

  if (
    !user ||
    typeof user.id !== "string" ||
    !user.id ||
    (user.role !== "admin" && user.role !== "agent") ||
    typeof user.tenantId !== "string" ||
    !user.tenantId
  ) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  };
}

/**
 * Returns the authenticated user only if they are an admin.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireUser();

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return user;
}
