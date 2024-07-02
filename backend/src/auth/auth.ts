import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import db from "../db/db_connect.js";
import { sessions, users } from "../db/schema.js";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users); // your adapter

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // we don't need to expose the password hash!
      name: attributes.name,
      email: attributes.email,
      phoneNo: attributes.phoneNo,
      role: attributes.role,
      status: attributes.status,
      photoUrl: attributes.photoUrl,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      name: string;
      email: string;
      phoneNo: string;
      role: "user" | "admin";
      status: boolean;
      photoUrl: string | null;
    };
  }
}
