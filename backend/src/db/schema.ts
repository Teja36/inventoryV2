import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const shelfEnums = pgEnum("shelf", ["left", "right", "bottom"]);
export const rackEnums = pgEnum("rack", ["top", "middle", "bottom", ""]);

export const roleEnums = pgEnum("role", ["user", "admin"]);

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  potency: text("potency").notNull(),
  quantity: smallint("quantity").notNull(),
  size: text("size").notNull(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  row: smallint("row").notNull(),
  col: smallint("col").notNull(),
  shelf: shelfEnums("shelf").notNull(),
  rack: rackEnums("rack").notNull(),
  medicine_id: serial("medicine_id")
    .references(() => medicines.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  phoneNo: text("phone_no").unique().notNull(),
  role: roleEnums("role").notNull().default("user"),
  status: boolean("status").notNull().default(false),
  hashedPassword: text("hashed_password"),
  googleId: text("google_id").unique(),
  photoUrl: text("photo_url"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
