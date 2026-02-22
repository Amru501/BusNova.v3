/**
 * Clears all data from all tables in the bus_pass database.
 * Run from project root: node scripts/clear-all-data.js
 *
 * Optional: create .env.local with MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 * or the script uses defaults (localhost, root, no password, bus_pass).
 */

const fs = require("fs");
const path = require("path");

// Load .env.local if it exists (simple parse, no extra deps)
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const mysql = require("mysql2/promise");

const poolConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "bus_pass",
};

// Order: child tables first (due to foreign keys when using DELETE)
// Using TRUNCATE with FK checks disabled is faster and resets AUTO_INCREMENT
const TABLES = ["payments", "passes", "buses", "routes", "admins", "users"];

async function clearAllData() {
  let conn;
  try {
    conn = await mysql.createConnection(poolConfig);
    console.log("Connected to database:", poolConfig.database);

    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    for (const table of TABLES) {
      await conn.query(`TRUNCATE TABLE ??`, [table]);
      console.log("  Cleared:", table);
    }

    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Done. All tables are empty and ready for fresh data.");
  } catch (err) {
    console.error("Error clearing data:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

clearAllData();
