// require("dotenv").config();
// const { Client } = require("pg");

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
// });

// async function connectDB() {
//   try {
//     await client.connect();
//     console.log("Connected to PostgreSQL database");
//   } catch (err) {
//     console.error("Connection error", err.stack);
//   }
// }

// connectDB();

// // To execute a query
// testQuery();

// async function testQuery() {
//   try {
//     const res = await client.query("SELECT NOW()");
//     console.log("Current Timestamp:", res.rows[0]);
//   } catch (err) {
//     console.error("Query error", err.stack);
//   } finally {
//     await client.end();
//   }
// }

require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database");
    client.release();
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}

connectDB();

module.exports = pool;
