const { getConnection } = require("./controllers/db");

async function testDatabaseConnection() {
  try {
    console.log("🔍 جاري اختبار الاتصال بقاعدة البيانات...");
    
    const connection = await getConnection();
    console.log("✅ تم الاتصال بقاعدة البيانات بنجاح!");
    
    // اختبار استعلام بسيط
    const [rows] = await connection.execute("SELECT 1 as test");
    console.log("✅ تم تنفيذ استعلام الاختبار بنجاح!");
    console.log("نتيجة الاستعلام:", rows);
    
    await connection.end();
    console.log("✅ تم إغلاق الاتصال بنجاح!");
    
  } catch (error) {
    console.error("❌ خطأ في الاتصال بقاعدة البيانات:");
    console.error("تفاصيل الخطأ:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error("💡 المشكلة: لا يمكن الوصول إلى السيرفر. تأكد من:");
      console.error("   - أن السيرفر يعمل على العنوان: 147.93.121.3:3120");
      console.error("   - أن الجدار الناري يسمح بالاتصال");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("💡 المشكلة: خطأ في بيانات الاعتماد. تأكد من:");
      console.error("   - اسم المستخدم وكلمة المرور صحيحان");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error("💡 المشكلة: قاعدة البيانات غير موجودة. تأكد من:");
      console.error("   - أن قاعدة البيانات 'ib' موجودة على السيرفر");
    }
  }
}

// تشغيل الاختبار
testDatabaseConnection();
