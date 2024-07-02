import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const client = new pg.Client({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

client
  .connect()
  .then(() => {
    console.log("Connected to postgres DB.");
  })
  .catch((err) => console.log(err));

const db = drizzle(client);

export default db;
