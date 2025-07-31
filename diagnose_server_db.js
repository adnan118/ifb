const { getConnection } = require("./controllers/db");

async function diagnoseServerDatabase() {
  console.log("🔍 === تشخيص مشكلة الاتصال على السيرفر ===");
  
  // فحص متغيرات البيئة
  console.log("\n📋 متغيرات البيئة:");
  console.log("   - DB_HOST:", process.env.DB_HOST || "147.93.121.3");
  console.log("   - DB_USER:", process.env.DB_USER || "root");
  console.log("   - DB_PASSWORD:", process.env.DB_PASSWORD ? "***محدد***" : "ifb118");
  console.log("   - DB_NAME:", process.env.DB_NAME || "ib");
  console.log("   - DB_PORT:", process.env.DB_PORT || 3120);
  console.log("   - NODE_ENV:", process.env.NODE_ENV || "غير محدد");
  
  // فحص إعدادات الاتصال
  console.log("\n📋 إعدادات الاتصال من controllers/db.js:");
  const dbConfig = {
    host: process.env.DB_HOST || "147.93.121.3",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "ifb118",
    database: process.env.DB_NAME || "ib",
    port: process.env.DB_PORT || 3120,
  };
  console.log("   - Host:", dbConfig.host);
  console.log("   - Port:", dbConfig.port);
  console.log("   - Database:", dbConfig.database);
  console.log("   - User:", dbConfig.user);
  
  try {
    console.log("\n🔄 جاري اختبار الاتصال...");
    const connection = await getConnection();
    console.log("✅ تم الاتصال بنجاح!");
    
    // اختبار إضافي - معلومات السيرفر
    const [serverInfo] = await connection.execute("SELECT VERSION() as version, @@hostname as hostname");
    console.log("   - إصدار MySQL:", serverInfo[0].version);
    console.log("   - اسم السيرفر:", serverInfo[0].hostname);
    
    await connection.end();
    console.log("\n✅ التشخيص مكتمل - الاتصال يعمل بشكل صحيح");
    
  } catch (error) {
    console.error("\n❌ فشل في الاتصال:");
    console.error("   - رمز الخطأ:", error.code);
    console.error("   - رسالة الخطأ:", error.message);
    console.error("   - تفاصيل إضافية:", error.stack ? error.stack.split('\n')[1] : "غير متوفر");
    
    // تحليل مفصل للخطأ
    console.log("\n🔍 تحليل الخطأ:");
    
    if (error.code === 'ECONNREFUSED') {
      console.log("   - المشكلة: السيرفر يرفض الاتصال");
      console.log("   - الحلول المحتملة:");
      console.log("     1. تأكد من أن MySQL يعمل على السيرفر");
      console.log("     2. تحقق من إعدادات الجدار الناري");
      console.log("     3. تأكد من أن المنفذ 3120 مفتوح");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("   - المشكلة: خطأ في بيانات الاعتماد");
      console.log("   - الحلول المحتملة:");
      console.log("     1. تحقق من اسم المستخدم وكلمة المرور");
      console.log("     2. تأكد من صلاحيات المستخدم");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log("   - المشكلة: قاعدة البيانات غير موجودة");
      console.log("   - الحلول المحتملة:");
      console.log("     1. تأكد من وجود قاعدة البيانات 'ib'");
      console.log("     2. تحقق من اسم قاعدة البيانات");
    } else if (error.code === 'ENOTFOUND') {
      console.log("   - المشكلة: لا يمكن العثور على السيرفر");
      console.log("   - الحلول المحتملة:");
      console.log("     1. تحقق من صحة عنوان IP");
      console.log("     2. تأكد من اتصال الإنترنت");
    } else {
      console.log("   - المشكلة: خطأ غير معروف");
      console.log("   - يرجى مراجعة سجلات السيرفر");
    }
    
    console.log("\n💡 اقتراحات إضافية:");
    console.log("   1. تحقق من سجلات السيرفر (logs)");
    console.log("   2. تأكد من إعدادات PM2 إذا كنت تستخدمه");
    console.log("   3. تحقق من متغيرات البيئة على السيرفر");
  }
}

// تشغيل التشخيص
diagnoseServerDatabase(); 