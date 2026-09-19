const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createSupplier() {
  try {
    const name = "Test Supplier";
    const email = "supplier@test.com";
    const password = "Supplier@123";

    const existingUser = await pool.query(
      `
      SELECT id, name, email, role
      FROM users
      WHERE LOWER(email) = LOWER($1)
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log("");
      console.log("Supplier already exists.");
      console.log(existingUser.rows[0]);
      console.log("");

      await pool.end();
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

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
      VALUES ($1, $2, $3, 'supplier', TRUE, TRUE)
      RETURNING id, name, email, role
      `,
      [
        name,
        email,
        passwordHash,
      ]
    );

    console.log("");
    console.log("=================================");
    console.log("Supplier created successfully");
    console.log("=================================");
    console.log("ID:", result.rows[0].id);
    console.log("Name:", result.rows[0].name);
    console.log("Email:", result.rows[0].email);
    console.log("Role:", result.rows[0].role);
    console.log("Password:", password);
    console.log("=================================");
    console.log("");

    await pool.end();
  } catch (error) {
    console.error("Error creating supplier:", error);
    await pool.end();
  }
}

createSupplier();