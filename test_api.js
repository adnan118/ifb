const axios = require('axios');

async function testTrackingWeightAPI() {
  try {
    console.log('🔍 اختبار API تحديث الوزن...');
    
    const testData = {
      trakingWeight_user_id: 1,
      trakingWeight_current: 85
    };

    console.log('📤 إرسال البيانات:', testData);

    const response = await axios.post(
      'http://localhost:3118/api84818dataAnaly/updateOrInsertTrackingWeight',
      testData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ نجح الطلب!');
    console.log('📊 الاستجابة:', response.data);
    
  } catch (error) {
    console.log('❌ فشل الطلب!');
    if (error.response) {
      console.log('📊 كود الخطأ:', error.response.status);
      console.log('📊 رسالة الخطأ:', error.response.data);
    } else {
      console.log('📊 خطأ الشبكة:', error.message);
    }
  }
}

testTrackingWeightAPI(); 
