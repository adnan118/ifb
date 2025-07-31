const { getConnection } = require("./controllers/db");

async function detailedDatabaseTest() {
  console.log("🔍 === اختبار مفصل لقاعدة البيانات ===");
  console.log("📊 معلومات الاتصال:");
  console.log("   - السيرفر: 147.93.121.3");
  console.log("   - المنفذ: 3120");
  console.log("   - قاعدة البيانات: ib");
  console.log("   - المستخدم: root");
  console.log("");

  try {
    console.log("🔄 جاري الاتصال...");
    const connection = await getConnection();
    console.log("✅ تم الاتصال بنجاح!");
    
    // اختبار معلومات السيرفر
    console.log("\n📋 معلومات السيرفر:");
    const [serverInfo] = await connection.execute("SELECT VERSION() as version, NOW() as current_datetime");
    console.log("   - إصدار MySQL:", serverInfo[0].version);
    console.log("   - الوقت الحالي:", serverInfo[0].current_datetime);
    
    // اختبار قائمة الجداول
    console.log("\n📋 قائمة الجداول في قاعدة البيانات:");
    const [tables] = await connection.execute("SHOW TABLES");
    if (tables.length > 0) {
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
      });
    } else {
      console.log("   ⚠️ لا توجد جداول في قاعدة البيانات");
    }
    
    // اختبار عدد الجداول
    console.log(`\n📊 إجمالي عدد الجداول: ${tables.length}`);
    
    await connection.end();
    console.log("\n✅ تم إغلاق الاتصال بنجاح!");
    console.log("🎉 اختبار قاعدة البيانات مكتمل بنجاح!");
    
  } catch (error) {
    console.error("\n❌ فشل في الاتصال بقاعدة البيانات:");
    console.error("رمز الخطأ:", error.code);
    console.error("رسالة الخطأ:", error.message);
    
    // نصائح حسب نوع الخطأ
    console.log("\n💡 اقتراحات لحل المشكلة:");
    
    if (error.code === 'ECONNREFUSED') {
      console.log("1. تأكد من أن خادم MySQL يعمل على السيرفر");
      console.log("2. تحقق من إعدادات الجدار الناري");
      console.log("3. تأكد من صحة عنوان IP والمنفذ");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("1. تحقق من صحة اسم المستخدم وكلمة المرور");
      console.log("2. تأكد من صلاحيات المستخدم في قاعدة البيانات");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log("1. تأكد من وجود قاعدة البيانات 'ib'");
      console.log("2. تحقق من اسم قاعدة البيانات");
    } else if (error.code === 'ENOTFOUND') {
      console.log("1. تحقق من صحة عنوان IP للسيرفر");
      console.log("2. تأكد من اتصال الإنترنت");
    }
    
    console.log("\n🔧 للتحقق من الاتصال يدوياً:");
    console.log("   mysql -h 147.93.121.3 -P 3120 -u root -p");
  }
}

// تشغيل الاختبار المفصل
detailedDatabaseTest(); 