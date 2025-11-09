const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "ifb118",
  database: process.env.DB_NAME || "ib",
  port: process.env.DB_PORT || 3306,
 
 
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

module.exports = { getConnection };


