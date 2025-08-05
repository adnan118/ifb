async function testTrackingWeightAPI() {
  try {
    console.log('🔍 اختبار API تحديث الوزن...');
    
    const testData = {
      trakingWeight_user_id: 1,
      trakingWeight_current: 85
    };

    console.log('📤 إرسال البيانات:', testData);

    const response = await fetch(
      'http://localhost:3118/api84818dataAnaly/updateOrInsertTrackingWeight',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log('✅ نجح الطلب!');
      console.log('📊 الاستجابة:', responseData);
    } else {
      console.log('❌ فشل الطلب!');
      console.log('📊 كود الخطأ:', response.status);
      console.log('📊 رسالة الخطأ:', responseData);
    }
    
  } catch (error) {
    console.log('❌ فشل الطلب!');
    console.log('📊 خطأ الشبكة:', error.message);
  }
}

testTrackingWeightAPI(); 
