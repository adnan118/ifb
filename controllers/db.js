// controllers/database.js
const mysql = require("mysql2/promise");

// إعداد اتصال قاعدة البيانات
/*const dbConfig = {
  host: "mysql.railway.internal",
  user: "root",
  password: "oufXwWgHaDJpOinwoEefEmTRoGuyWobZ",
  database: "railway",
};*/
const dbConfig = {
  host: "dreamtsv.com",
  user: "u643198768_project_ifb",
  password: "projectIfb.118259",
  database: "u643198768_project_ifb",
};
// دالة للحصول على اتصال بقاعدة البيانات
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}



// تصدير الدالة
module.exports = { getConnection };

 
