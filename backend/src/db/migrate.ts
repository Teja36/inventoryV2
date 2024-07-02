import { migrate } from "drizzle-orm/node-postgres/migrator";
import db from "./db_connect.js";

async function migrateDB() {
  await migrate(db, { migrationsFolder: "src/drizzle" });
  process.exit(0);
}

migrateDB().catch((err) => {
  console.log(err);
  process.exit(0);
});
