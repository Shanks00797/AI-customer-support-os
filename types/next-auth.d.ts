import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "agent";
      tenantId: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "admin" | "agent";
    tenantId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "agent";
    tenantId?: string;
  }
}
