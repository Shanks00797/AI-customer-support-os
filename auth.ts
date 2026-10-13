import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getUsersCollection } from "@/lib/models/user";
import { loginSchema } from "@/lib/validators/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const result = loginSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;
        const users = await getUsersCollection();

        const user = await users.findOne({ email });

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id.toHexString(),
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId.toHexString(),
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authenticatedUser = user as typeof user & {
          role: "admin" | "agent";
          tenantId: string;
        };

        token.role = authenticatedUser.role;
        token.tenantId = authenticatedUser.tenantId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id: string;
          role: "admin" | "agent";
          tenantId: string;
        };

        if (
          typeof token.sub !== "string" ||
          !ObjectId.isValid(token.sub) ||
          (token.role !== "admin" && token.role !== "agent") ||
          typeof token.tenantId !== "string" ||
          !ObjectId.isValid(token.tenantId)
        ) {
          throw new Error("Invalid session claims.");
        }

        sessionUser.id = token.sub;
        sessionUser.role = token.role;
        sessionUser.tenantId = token.tenantId;
      }

      return session;
    },
  },
});
