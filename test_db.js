const { getConnection } = require('./controllers/db');

async function testConnection() {
  

  try {
    const connection = await getConnection();
    console.log('Database contacted!');
    await connection.end(); // لإغلاق الاتصال بعد الاختبار
  } catch (err) {
    console.error('Database connection failed', err);
  }
}

testConnection();
