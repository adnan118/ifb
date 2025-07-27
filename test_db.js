const { getConnection } = require('./controllers/db');

async function testConnection() {
  try {
    const connection = await getConnection();
    console.log('تم الاتصال بنجاح بقاعدة البيانات!');
    await connection.end(); // لإغلاق الاتصال بعد الاختبار
  } catch (err) {
    console.error('فشل الاتصال بقاعدة البيانات:', err);
  }
}

testConnection();
