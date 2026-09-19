require("dotenv").config()

const bcrypt = require("bcryptjs")
const { Pool } = require("pg")

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

async function createSuperAdmin() {
  try {
    const name = process.env.SUPER_ADMIN_NAME
    const email = process.env.SUPER_ADMIN_EMAIL
    const password = process.env.SUPER_ADMIN_PASSWORD

    if (!name || !email || !password) {
      throw new Error(
        "SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required."
      )
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    )

    if (existingUser.rows.length > 0) {
      console.log("Super Admin already exists.")
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await pool.query(
      `
      INSERT INTO users
      (name, email, password_hash, role, is_active, is_verified)
      VALUES ($1, $2, $3, 'super_admin', TRUE, TRUE)
      `,
      [name, email, passwordHash]
    )

    console.log("Super Admin created successfully.")
    console.log(`Email: ${email}`)
  } catch (error) {
    console.error("Error creating Super Admin:", error.message)
  } finally {
    await pool.end()
  }
}

createSuperAdmin()