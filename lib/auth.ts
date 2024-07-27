import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, TimeSpan } from "lucia";
import env from "./env";
import prisma from "./prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, "w"), // 2 weeks
  getSessionAttributes: (attributes) => {
    return {
      ipCountry: attributes,
    };
  },
  getUserAttributes: (attributes) => {
    return attributes;
  },
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    },
  },
});
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface DatabaseSessionAttributes {}
  interface DatabaseUserAttributes {
    email: string;
    id: string;
    name: string;
    email_verified: boolean;
  }
}
