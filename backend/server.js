const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
require("dotenv").config();

const multer = require("multer");
const path = require("path");
const fs = require("fs");


const app = express();
const authenticateToken = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Insight Image Uploads
// ===============================

const insightUploadDir = path.join(__dirname, "uploads", "insights");

if (!fs.existsSync(insightUploadDir)) {
  fs.mkdirSync(insightUploadDir, {
    recursive: true,
  });
}

const companyUploadDir = path.join(__dirname, "uploads", "companies");

if (!fs.existsSync(companyUploadDir)) {
  fs.mkdirSync(companyUploadDir, {
    recursive: true,
  });
}
// ===============================
// Product Image Uploads
// ===============================

const productUploadDir = path.join(__dirname, "uploads", "products");

if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, {
    recursive: true,
  });
}

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      `product-${Date.now()}-${Math.round(Math.random() * 1e9)}` + extension;

    cb(null, filename);
  },
});

const productUpload = multer({
  storage: productStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }

    cb(null, true);
  },
});

const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, companyUploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      `company-${Date.now()}-${Math.round(Math.random() * 1e9)}` + extension;

    cb(null, filename);
  },
});

const companyUpload = multer({
  storage: companyStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }

    cb(null, true);
  },
});

const insightStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, insightUploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename = `insight-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, filename);
  },
});

const insightUpload = multer({
  storage: insightStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
  },
});

// Serve uploaded insight images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// PostgreSQL Database Connection
// ===============================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ===============================
// Test Database Connection
// ===============================

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Vyapaar Bharat API is running",
  });
});

// ==================================================
// AUTHENTICATION
// ==================================================

// ===============================
// Login
// ===============================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        phone,
        is_active,
        is_verified
      FROM users
      WHERE LOWER(email) = LOWER($1)
      `,
      [email.trim()],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    await pool.query(
      `
      UPDATE users
      SET last_login_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [user.id],
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.is_active,
        isVerified: user.is_verified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// ===============================
// Google Login
// ===============================

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const {
      sub: googleId,
      email,
      name,
      email_verified: emailVerified,
    } = payload;

    if (!email || !emailVerified) {
      return res.status(401).json({
        success: false,
        message: "Google email could not be verified",
      });
    }

    // ==========================================
    // Check Google ID
    // ==========================================

    let result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        phone,
        is_active,
        is_verified,
        google_id,
        auth_provider
      FROM users
      WHERE google_id = $1
      `,
      [googleId]
    );

    // ==========================================
    // Existing Google User
    // ==========================================

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Your account has been disabled.",
        });
      }

      await pool.query(
        `
        UPDATE users
        SET
          last_login_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [user.id]
      );

      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        success: true,
        message: "Google login successful",
        token,
        needsRoleSelection: user.role === "user",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isActive: user.is_active,
          isVerified: user.is_verified,
        },
      });
    }

    // ==========================================
    // Check Existing Email
    // ==========================================

    result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        phone,
        is_active,
        is_verified
      FROM users
      WHERE LOWER(email) = LOWER($1)
      `,
      [email]
    );

    // ==========================================
    // Existing Account → Link Google
    // ==========================================

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Your account has been disabled.",
        });
      }

      const updatedResult = await pool.query(
        `
        UPDATE users
        SET
          google_id = $1,
          auth_provider = 'google',
          is_verified = true,
          last_login_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING
          id,
          name,
          email,
          role,
          phone,
          is_active,
          is_verified
        `,
        [googleId, user.id]
      );

      const updatedUser = updatedResult.rows[0];

      const token = jwt.sign(
        {
          userId: updatedUser.id,
          role: updatedUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        success: true,
        message: "Google account linked successfully",
        token,
        needsRoleSelection: updatedUser.role === "user",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          isActive: updatedUser.is_active,
          isVerified: updatedUser.is_verified,
        },
      });
    }

    // ==========================================
    // Create New Google User
    // ==========================================

    const newUserResult = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        is_active,
        is_verified,
        google_id,
        auth_provider,
        last_login_at,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        NULL,
        'user',
        true,
        true,
        $3,
        'google',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        name,
        email,
        role,
        phone,
        is_active,
        is_verified
      `,
      [
        name || email.split("@")[0],
        email,
        googleId,
      ]
    );

    const newUser = newUserResult.rows[0];

    // ==========================================
    // Generate JWT
    // ==========================================

    const token = jwt.sign(
      {
        userId: newUser.id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Google account created successfully",
      token,
      needsRoleSelection: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        isActive: newUser.is_active,
        isVerified: newUser.is_verified,
      },
    });

  } catch (error) {
    console.error("Google login error:", error);

    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
});

// ===============================
// Select Buyer / Supplier Role
// ===============================

app.post(
  "/api/auth/select-role",
  authenticateToken,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["buyer", "supplier"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Please select buyer or supplier",
        });
      }

      // Admin roles cannot use role selection
      if (
        req.user.role === "admin" ||
        req.user.role === "super_admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Admin roles cannot be changed here",
        });
      }

      const result = await pool.query(
        `
        UPDATE users
        SET
          role = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING
          id,
          name,
          email,
          phone,
          role,
          is_active,
          is_verified
        `,
        [role, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = result.rows[0];

      // Generate new JWT with selected role
      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        success: true,
        message: "Role selected successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.is_active,
          isVerified: user.is_verified,
        },
      });
    } catch (error) {
      console.error("Select role error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to select role",
      });
    }
  }
);

// ==================================================
// REQUIREMENTS
// ==================================================


// ===============================
// Create Requirement
// ===============================

app.post(
  "/api/requirements",
  authenticateToken,
  async (req, res) => {
  try {
    const {
      title,
      category,
      subcategory,
      quantity,
      unit,
      description,
      minBudget,
      maxBudget,
      deliveryLocation,
      requiredBy,
    } = req.body;


//     app.post(
//   "/api/auth/select-role",
//   authenticateToken,
//   async (req, res) => {
//     try {
//       const { role } = req.body;

//       // Only these roles can be selected by normal users
//       if (!["buyer", "supplier"].includes(role)) {
//         return res.status(400).json({
//           success: false,
//           message: "Please select a valid role: buyer or supplier",
//         });
//       }

//       // Admin roles cannot be changed from this flow
//       if (
//         req.user.role === "admin" ||
//         req.user.role === "super_admin"
//       ) {
//         return res.status(403).json({
//           success: false,
//           message: "Admin roles cannot be changed here",
//         });
//       }

//       // Update user's role
//       const result = await pool.query(
//         `
//         UPDATE users
//         SET role = $1
//         WHERE id = $2
//         RETURNING id, name, email, phone, role, is_active, is_verified
//         `,
//         [role, req.user.id]
//       );

//       if (result.rows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       const user = result.rows[0];

//       // Create a new JWT with the newly selected role
//       const token = jwt.sign(
//         {
//           userId: user.id,
//           role: user.role,
//         },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "7d",
//         }
//       );

//       res.json({
//         success: true,
//         message: `Role selected successfully as ${role}`,
//         token,
//         user,
//       });
//     } catch (error) {
//       console.error("Select role error:", error);

//       res.status(500).json({
//         success: false,
//         message: "Failed to select role",
//       });
//     }
//   }
// );

    // ===============================
    // VALIDATION
    // ===============================

    if (
      !title ||
      !category ||
      !quantity ||
      !unit ||
      !description ||
      !deliveryLocation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, category, quantity, unit, description and delivery location are required",
      });
    }

    // ===============================
    // CREATE REQUIREMENT
    // ===============================

    const result = await pool.query(
      `
      INSERT INTO requirements (
    title,
    category,
    subcategory,
    quantity,
    unit,
    description,
    min_budget,
    max_budget,
    delivery_location,
    required_by,
    buyer_id
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11
)
RETURNING *
      `,
      [
        title.trim(),
        category.trim(),
        subcategory ? subcategory.trim() : null,
        Number(quantity),
        unit.trim(),
        description.trim(),
        minBudget !== "" && minBudget != null
          ? Number(minBudget)
          : null,
        maxBudget !== "" && maxBudget != null
          ? Number(maxBudget)
          : null,
        deliveryLocation.trim(),
        requiredBy || null,
          req.user.id,
      ],
    );

    // ===============================
    // SUCCESS RESPONSE
    // ===============================

    res.status(201).json({
      success: true,
      message: "Requirement created successfully",
      requirement: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating requirement:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create requirement",
    });
  }
});




// ===============================
// Get All Requirements
// WITH QUOTE COUNT
// ===============================

app.get("/api/requirements", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.*,
        COUNT(q.id)::INTEGER AS quote_count
      FROM requirements r
      LEFT JOIN quotes q
        ON q.requirement_id = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      requirements: result.rows,
    });
  } catch (error) {
    console.error(
      "Error fetching requirements:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch requirements",
    });
  }
});


// ===============================
// Get My Requirements
// Logged-in Buyer Only
// ===============================

app.get(
  "/api/my-requirements",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          r.*,
          COUNT(q.id)::INTEGER AS quote_count
        FROM requirements r
        LEFT JOIN quotes q
          ON q.requirement_id = r.id
        WHERE r.buyer_id = $1
        GROUP BY r.id
        ORDER BY r.created_at DESC
        `,
        [req.user.id]
      );

      res.json({
        success: true,
        requirements: result.rows,
      });
    } catch (error) {
      console.error("Error fetching my requirements:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch your requirements",
      });
    }
  }
);

// ===============================
// Get Single Requirement
// ===============================

app.get("/api/requirements/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        *
      FROM requirements
      WHERE id = $1
      `,
      [id],
    );

    // ===============================
    // NOT FOUND
    // ===============================

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    // ===============================
    // SUCCESS
    // ===============================

    res.json({
      success: true,
      requirement: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Error fetching requirement:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch requirement",
    });
  }
});


// ==================================================
// ADMIN - ALL QUOTES
// ==================================================

app.get("/api/admin/quotes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        q.id,
        q.requirement_id,
        q.supplier_name,
        q.supplier_email,
        q.quoted_price,
        q.quantity,
        q.unit,
        q.delivery_time,
        q.message,
        q.status,
        q.created_at,
        q.updated_at,

        r.title AS requirement_title,
        r.category AS requirement_category,
        r.delivery_location AS requirement_location

      FROM quotes q

      LEFT JOIN requirements r
        ON q.requirement_id = r.id

      ORDER BY q.created_at DESC
    `);

    res.json({
      success: true,
      quotes: result.rows,
    });

  } catch (error) {
    console.error("Error fetching admin quotes:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quotes",
    });
  }
});
// ==================================================
// QUOTES
// ==================================================

// ===============================
// Get My Quotes
// Logged-in Supplier Only
// ===============================

app.get(
  "/api/my-quotes",
  authenticateToken,
  async (req, res) => {
    try {
      // Only suppliers can access this page
      if (req.user.role !== "supplier") {
        return res.status(403).json({
          success: false,
          message: "Only suppliers can access their quotes",
        });
      }

      const result = await pool.query(
        `
        SELECT
          q.*,
          r.title AS requirement_title,
          r.category AS requirement_category,
          r.subcategory AS requirement_subcategory,
          r.delivery_location AS requirement_delivery_location,
          r.required_by AS requirement_required_by
        FROM quotes q
        LEFT JOIN requirements r
          ON q.requirement_id = r.id
        WHERE q.supplier_user_id = $1
        ORDER BY q.created_at DESC
        `,
        [req.user.id]
      );

      res.json({
        success: true,
        quotes: result.rows,
      });
    } catch (error) {
      console.error("Error fetching my quotes:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch your quotes",
      });
    }
  }
);


// ===============================
// Create Supplier Quote
// ===============================

app.post(
  "/api/quotes",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        requirementId,
        supplierName,
        supplierEmail,
        quotedPrice,
        quantity,
        unit,
        deliveryTime,
        message,
      } = req.body;

      if (
        !requirementId ||
        !supplierName ||
        !quotedPrice ||
        !quantity ||
        !unit
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Requirement, supplier name, quoted price, quantity and unit are required",
        });
      }

      // Only suppliers can submit quotes
      if (req.user.role !== "supplier") {
        return res.status(403).json({
          success: false,
          message: "Only suppliers can submit quotes",
        });
      }

      // Check requirement
      const requirementResult = await pool.query(
        `
        SELECT id, status
        FROM requirements
        WHERE id = $1
        `,
        [requirementId],
      );

      if (requirementResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Requirement not found",
        });
      }

      const requirement = requirementResult.rows[0];

      if (requirement.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "This requirement has already been accepted",
        });
      }

      // Create quote
      const result = await pool.query(
        `
        INSERT INTO quotes (
          requirement_id,
          supplier_user_id,
          supplier_name,
          supplier_email,
          quoted_price,
          quantity,
          unit,
          delivery_time,
          message,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
        RETURNING *
        `,
        [
          requirementId,
          req.user.id,
          supplierName,
          supplierEmail || null,
          Number(quotedPrice),
          Number(quantity),
          unit,
          deliveryTime || null,
          message || null,
        ],
      );

      // Update requirement status
      await pool.query(
        `
        UPDATE requirements
        SET
          status = 'quoted',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND status != 'accepted'
        `,
        [requirementId],
      );

      res.status(201).json({
        success: true,
        message: "Quote submitted successfully",
        quote: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating quote:", error);

      res.status(500).json({
        success: false,
        message: "Failed to submit quote",
      });
    }
  },
);

// ===============================
// Get Quotes For Requirement
// ===============================

app.get("/api/requirements/:id/quotes", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT *
        FROM quotes
        WHERE requirement_id = $1
        ORDER BY created_at DESC
        `,
      [id],
    );

    res.json({
      success: true,
      quotes: result.rows,
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quotes",
    });
  }
});

// ===============================
// Get Single Quote
// ===============================

app.get("/api/quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        q.*,
        r.title AS requirement_title,
        r.category AS requirement_category,
        r.delivery_location AS requirement_delivery_location
      FROM quotes q
      JOIN requirements r
        ON q.requirement_id = r.id
      WHERE q.id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.json({
      success: true,
      quote: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching quote:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quote",
    });
  }
});

// ===============================
// Update Quote Status
// ===============================

app.patch("/api/quotes/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "accepted", "rejected", "negotiating"];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid quote status. Allowed values: pending, accepted, rejected, negotiating",
      });
    }

    const existingQuote = await pool.query(
      `
          SELECT *
          FROM quotes
          WHERE id = $1
          `,
      [id],
    );

    if (existingQuote.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    const quote = existingQuote.rows[0];

    // ===============================
    // ACCEPT QUOTE
    // ===============================

    if (status === "accepted") {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const quoteResult = await client.query(
          `
              UPDATE quotes
              SET
                status = 'accepted',
                updated_at = CURRENT_TIMESTAMP
              WHERE id = $1
              RETURNING *
              `,
          [id],
        );

        await client.query(
          `
            UPDATE quotes
            SET
              status = 'rejected',
              updated_at = CURRENT_TIMESTAMP
            WHERE requirement_id = $1
              AND id != $2
              AND status != 'rejected'
            `,
          [quote.requirement_id, id],
        );

        await client.query(
          `
            UPDATE requirements
            SET
              status = 'accepted',
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            `,
          [quote.requirement_id],
        );

        await client.query("COMMIT");

        return res.json({
          success: true,
          message: "Quote accepted successfully",
          quote: quoteResult.rows[0],
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    // ===============================
    // REJECT QUOTE
    // ===============================

    if (status === "rejected") {
      const quoteResult = await pool.query(
        `
            UPDATE quotes
            SET
              status = 'rejected',
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
            `,
        [id],
      );

      const activeQuotes = await pool.query(
        `
            SELECT COUNT(*) AS count
            FROM quotes
            WHERE requirement_id = $1
              AND status IN (
                'pending',
                'negotiating',
                'accepted'
              )
            `,
        [quote.requirement_id],
      );

      const activeCount = Number(activeQuotes.rows[0].count);

      if (activeCount === 0) {
        await pool.query(
          `
            UPDATE requirements
            SET
              status = 'open',
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND status != 'accepted'
            `,
          [quote.requirement_id],
        );
      }

      return res.json({
        success: true,
        message: "Quote rejected successfully",
        quote: quoteResult.rows[0],
      });
    }

    // ===============================
    // NEGOTIATING / PENDING
    // ===============================

    const result = await pool.query(
      `
        UPDATE quotes
        SET
          status = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
      [status, id],
    );

    if (status === "negotiating") {
      await pool.query(
        `
          UPDATE requirements
          SET
            status = 'negotiating',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND status != 'accepted'
          `,
        [quote.requirement_id],
      );
    }

    res.json({
      success: true,
      message: `Quote ${status} successfully`,
      quote: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating quote status:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quote status",
    });
  }
});

// ==================================================
// SUPPLIERS
// ==================================================

// ===============================
// Get All Suppliers
// ===============================

app.get("/api/suppliers", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM suppliers
      ORDER BY created_at DESC
      `,
    );

    res.json({
      success: true,
      suppliers: result.rows,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers",
    });
  }
});

// ===============================
// Get Single Supplier
// ===============================

app.get("/api/suppliers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT *
        FROM suppliers
        WHERE id = $1
        `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.json({
      success: true,
      supplier: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching supplier:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch supplier",
    });
  }
});

// ==================================================
// PRODUCTS
// ==================================================

// ===============================
// Get All Products
// ===============================

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.*,
        s.name AS supplier_name,
        s.location AS supplier_location,
        s.verified AS supplier_verified,
        s.rating AS supplier_rating
      FROM products p
      JOIN suppliers s
        ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
      `,
    );

    res.json({
      success: true,
      products: result.rows,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

// ===============================
// GET ALL INSIGHTS
// ===============================

app.get("/api/insights", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        category,
        category_id,
        excerpt,
        content,
        image_url,
        created_at
      FROM insights
      ORDER BY created_at DESC, id DESC
    `);

    res.json({
      success: true,
      insights: result.rows,
    });
  } catch (error) {
    console.error("Error fetching insights:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch insights",
    });
  }
});

// ===============================
// GET SINGLE INSIGHT
// ===============================

app.get("/api/insights/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT
          id,
          title,
          category,
          category_id,
          excerpt,
          content,
          image_url,
          created_at
        FROM insights
        WHERE id = $1
        `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
      });
    }

    res.json({
      success: true,
      insight: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching insight:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch insight",
    });
  }
});

// ===============================
// Get Single Product
// ===============================

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT
          p.*,
          s.name AS supplier_name,
          s.business_type AS supplier_business_type,
          s.industry AS supplier_industry,
          s.location AS supplier_location,
          s.address AS supplier_address,
          s.description AS supplier_description,
          s.phone AS supplier_phone,
          s.email AS supplier_email,
          s.years_in_business AS supplier_years,
          s.verified AS supplier_verified,
          s.rating AS supplier_rating,
          s.reviews AS supplier_reviews
        FROM products p
        JOIN suppliers s
          ON p.supplier_id = s.id
        WHERE p.id = $1
        `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

// ==================================================
// INSIGHTS ADMIN
// ==================================================

// ===============================
// CREATE INSIGHT
// ===============================

app.post("/api/insights", async (req, res) => {
  try {
    const { title, category, category_id, excerpt, content, image_url } =
      req.body;

    if (!title || !category || !category_id || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, category, excerpt and content are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO insights
      (
        title,
        category,
        category_id,
        excerpt,
        content,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [title, category, category_id, excerpt, content, image_url || null],
    );

    res.status(201).json({
      success: true,
      message: "Insight created successfully.",
      insight: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating insight:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create insight.",
    });
  }
});

// ===============================
// UPDATE INSIGHT
// ===============================

app.put("/api/insights/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { title, category, category_id, excerpt, content, image_url } =
      req.body;

    if (!title || !category || !category_id || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, category, excerpt and content are required.",
      });
    }

    const result = await pool.query(
      `
        UPDATE insights
        SET
          title = $1,
          category = $2,
          category_id = $3,
          excerpt = $4,
          content = $5,
          image_url = $6,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
        `,
      [title, category, category_id, excerpt, content, image_url || null, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Insight not found.",
      });
    }

    res.json({
      success: true,
      message: "Insight updated successfully.",
      insight: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating insight:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update insight.",
    });
  }
});

// ===============================
// CREATE COMPANY / SUPPLIER
// ===============================

app.post("/api/suppliers", async (req, res) => {
  try {
    const {
      name,
      businessType,
      industry,
      location,
      address,
      description,
      phone,
      email,
      yearsInBusiness,
      verified,
      services,
      serviceAreas,
      imageUrl,
      galleryImages,
    } = req.body;

    // ===============================
    // Validate company name
    // ===============================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // ===============================
    // Convert services into array
    // ===============================

    const servicesArray = Array.isArray(services)
      ? services.filter(Boolean)
      : services
        ? services
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    // ===============================
    // Convert service areas into array
    // ===============================

    const serviceAreasArray = Array.isArray(serviceAreas)
      ? serviceAreas.filter(Boolean)
      : serviceAreas
        ? serviceAreas
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    // ===============================
    // Gallery images
    // ===============================

    const galleryImagesArray = Array.isArray(galleryImages)
      ? galleryImages.filter(Boolean)
      : [];

    // ===============================
    // Create company
    // ===============================

    const result = await pool.query(
      `
      INSERT INTO suppliers (
        name,
        business_type,
        industry,
        location,
        address,
        description,
        phone,
        email,
        years_in_business,
        verified,
        services,
        service_areas,
        image_url,
        gallery_images
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14
      )
      RETURNING *
      `,
      [
        name.trim(),
        businessType || null,
        industry || null,
        location || null,
        address || null,
        description || null,
        phone || null,
        email || null,
        yearsInBusiness ? Number(yearsInBusiness) : null,
        Boolean(verified),
        servicesArray,
        serviceAreasArray,
        imageUrl || null,
        galleryImagesArray,
      ],
    );

    // ===============================
    // Success response
    // ===============================

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      supplier: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating company:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create company",
    });
  }
});

// ===============================
// UPLOAD COMPANY IMAGES
// ===============================

app.post(
  "/api/suppliers/upload-images",
  companyUpload.array("images", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please select at least one image.",
        });
      }

      const imageUrls = req.files.map(
        (file) =>
          `/uploads/companies/${file.filename}`,
      );

      res.status(201).json({
        success: true,
        message: "Company images uploaded successfully.",
        images: imageUrls,
      });
    } catch (error) {
      console.error("Company image upload error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to upload company images.",
      });
    }
  },
);

// ===============================
// UPLOAD PRODUCT IMAGE
// ===============================

app.post(
  "/api/products/upload-image",
  productUpload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      const imageUrl =
        `http://localhost:${process.env.PORT || 5000}` +
        `/uploads/products/${req.file.filename}`;

      res.status(201).json({
        success: true,
        message: "Product image uploaded successfully.",
        image_url: imageUrl,
      });
    } catch (error) {
      console.error("Product image upload error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to upload product image.",
      });
    }
  },
);

// ===============================
// CREATE PRODUCT
// ===============================

app.post("/api/products", async (req, res) => {
  try {
    const {
      supplierId,
      name,
      category,
      subcategory,
      description,
      price,
      priceUnit,
      moq,
      moqUnit,
      availability,
      imageUrl,
    } = req.body;

    // ===============================
    // VALIDATION
    // ===============================

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Company is required.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    // ===============================
    // CHECK COMPANY
    // ===============================

    const supplierResult = await pool.query(
      `
      SELECT id, name
      FROM suppliers
      WHERE id = $1
      `,
      [supplierId],
    );

    if (supplierResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // ===============================
    // CREATE PRODUCT
    // ===============================

    const result = await pool.query(
      `
      INSERT INTO products (
        supplier_id,
        name,
        category,
        subcategory,
        description,
        price,
        price_unit,
        moq,
        moq_unit,
        availability,
        image_url
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
      )
      RETURNING *
      `,
      [
        Number(supplierId),
        name.trim(),
        category || null,
        subcategory || null,
        description || null,
        price !== "" && price != null ? Number(price) : null,
        priceUnit || null,
        moq !== "" && moq != null ? Number(moq) : null,
        moqUnit || null,
        availability || "Available",
        imageUrl || null,
      ],
    );

    // ===============================
    // SUCCESS
    // ===============================

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
});

// ===============================
// DELETE INSIGHT
// ===============================

app.delete("/api/insights/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        DELETE FROM insights
        WHERE id = $1
        RETURNING id
        `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Insight not found.",
      });
    }

    res.json({
      success: true,
      message: "Insight deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting insight:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete insight.",
    });
  }
});

// ===============================
// UPLOAD INSIGHT IMAGE
// ===============================

app.post(
  "/api/insights/upload-image",
  insightUpload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/insights/${req.file.filename}`;

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        image_url: imageUrl,
      });
    } catch (error) {
      console.error("Insight image upload error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to upload image.",
      });
    }
  },
);

// ===============================
// UPDATE PRODUCT
// ===============================

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      supplierId,
      name,
      category,
      subcategory,
      description,
      price,
      priceUnit,
      moq,
      moqUnit,
      availability,
      imageUrl,
    } = req.body;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "Company is required.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    const productResult = await pool.query(
      `
      SELECT id
      FROM products
      WHERE id = $1
      `,
      [id],
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const supplierResult = await pool.query(
      `
      SELECT id
      FROM suppliers
      WHERE id = $1
      `,
      [supplierId],
    );

    if (supplierResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const result = await pool.query(
      `
      UPDATE products
      SET
        supplier_id = $1,
        name = $2,
        category = $3,
        subcategory = $4,
        description = $5,
        price = $6,
        price_unit = $7,
        moq = $8,
        moq_unit = $9,
        availability = $10,
        image_url = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
      `,
      [
        Number(supplierId),
        name.trim(),
        category || null,
        subcategory || null,
        description || null,
        price !== "" && price != null ? Number(price) : null,
        priceUnit || null,
        moq !== "" && moq != null ? Number(moq) : null,
        moqUnit || null,
        availability || "Available",
        imageUrl || null,
        Number(id),
      ],
    );

    res.json({
      success: true,
      message: "Product updated successfully.",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
});

// ==================================================
// START SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
