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
  host: "auth-db1687.hstgr.io",
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

























/*

// server.js

const express              = require("express");
const UserRoutes           = require("./routes/allUsers");
const LoginUserRout        = require("./routes/authRoutes/LoginUserRout");
const RegisterUserRout     = require("./routes/authRoutes/RegisterUserRout");
const VerifyUserRout       = require("./routes/authRoutes/VfcRout");
const ResendVerifyUserRout = require("./routes/authRoutes/ResendVfcUserRout");

const app = express();
const PORT = process.env.PORT || 3000;
// app.use(express.urlencoded({ extended: false }));  // هذا مطلوب لـ x-www-form-urlencoded
app.use(express.json());
  
app.get("/", (req, res) => {  
 res.json({ message: "Hello, world!" }); 
  
 });  
app.use("/api118259y", LoginUserRout);
app.use("/api118259y", UserRoutes);
app.use("/api118259y", RegisterUserRout);
app.use("/api118259y", VerifyUserRout);
app.use("/api118259y", ResendVerifyUserRout);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
*/
