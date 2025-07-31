const { exec } = require('child_process');

console.log("🔄 === إعادة تشغيل السيرفر ===");

// إيقاف التطبيق الحالي
console.log("⏹️ إيقاف التطبيق الحالي...");
exec('pm2 stop fatemaifb', (error, stdout, stderr) => {
  if (error) {
    console.log("⚠️ تحذير: لم يتم العثور على التطبيق أو تم إيقافه بالفعل");
  } else {
    console.log("✅ تم إيقاف التطبيق");
  }
  
  // حذف التطبيق من PM2
  console.log("🗑️ حذف التطبيق من PM2...");
  exec('pm2 delete fatemaifb', (error, stdout, stderr) => {
    if (error) {
      console.log("⚠️ تحذير: لم يتم العثور على التطبيق للحذف");
    } else {
      console.log("✅ تم حذف التطبيق");
    }
    
    // إعادة تشغيل التطبيق مع الإعدادات الجديدة
    console.log("🚀 إعادة تشغيل التطبيق مع الإعدادات الجديدة...");
    exec('pm2 start ecosystem.config.js', (error, stdout, stderr) => {
      if (error) {
        console.error("❌ خطأ في إعادة تشغيل التطبيق:", error.message);
        console.log("\n💡 يمكنك تشغيل التطبيق يدوياً:");
        console.log("   pm2 start ecosystem.config.js");
      } else {
        console.log("✅ تم إعادة تشغيل التطبيق بنجاح!");
        console.log("\n📊 حالة التطبيق:");
        exec('pm2 status', (error, stdout, stderr) => {
          if (!error) {
            console.log(stdout);
          }
        });
        
        console.log("\n🔍 للتحقق من السجلات:");
        console.log("   pm2 logs fatemaifb");
      }
    });
  });
}); 