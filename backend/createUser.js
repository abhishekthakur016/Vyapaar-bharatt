const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createUser() {
  try {
    const name = "Test User";
    const email = "user@test.com";
    const password = "User@123";
    const role = "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        is_active,
        is_verified
      )
      VALUES ($1, $2, $3, $4, TRUE, FALSE)
      RETURNING id, name, email, role
      `,
      [name, email, hashedPassword, role]
    );

    console.log("User created successfully");
    console.log(result.rows[0]);
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await pool.end();
  }
}

createUser();