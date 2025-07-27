const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "147.93.121.3",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "ifb118",
  database: process.env.DB_NAME || "ib",
  port: process.env.DB_PORT || "3120",
 
 
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

module.exports = { getConnection };

