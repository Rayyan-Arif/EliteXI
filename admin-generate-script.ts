// scripts/create-admin.ts
import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function createAdmin() {
  const email = "admin@elitexi.com";
  const password = "admin1234"; // Change this
  const hashedPassword = await bcrypt.hash(password, 12);

  await pool.query(
    `
    INSERT INTO users (
      name,
      email,
      password,
      role
    )
    VALUES ($1, $2, $3, $4);
    `,
    [
      "System Admin",
      email,
      hashedPassword,
      "ADMIN",
    ]
  );

  console.log("Admin created successfully.");
  await pool.end();
}

createAdmin().catch(async (err) => {
  console.error(err);
  await pool.end();
});