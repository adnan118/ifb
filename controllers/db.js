const mysql = require("mysql2/promise");

const dbConfig = {
/*  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
*/
  host: '147.93.121.3',   // عنوان السيرفر
  port: 3120,             // منفذ قاعدة البيانات
  user: 'root',
  password: 'ifb118',
  database: 'ib',  
 
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

module.exports = { getConnection };

