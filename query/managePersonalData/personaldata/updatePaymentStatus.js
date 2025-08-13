const { getData, updateData } = require("../../../controllers/functions");

// دالة لتعديل حالة الدفع وتحديث تاريخ الانتهاء
async function updatePaymentStatus(req, res) {
  try {
    const { personalData_users_id } = req.body;

    // التحقق من وجود معرف المستخدم
    if (!personalData_users_id) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required"
      });
    }

    // جلب البيانات الحالية للمستخدم
    const currentDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id],
      true
    );

    if (
      currentDataResult.status !== "success" ||
      currentDataResult.data.length === 0
    ) {
      return res.status(404).json({
        status: "failure",
        message: "User not found"
      });
    }

    const currentData = currentDataResult.data;

    // التحقق من أن حالة الدفع الحالية هي 0 (غير مدفوع)
    if (currentData.personalData_isPaidOffer === 1) {
      return res.status(400).json({
        status: "failure",
        message: "Payment is already completed"
      });
    }

    // حساب تاريخ الانتهاء الجديد (شهر واحد من الآن)
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    
    // إضافة شهر واحد
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    
    // التأكد من أن التاريخ صحيح في حالة الأشهر التي لها أيام أقل
    // مثلاً إذا كان التاريخ الحالي 31 يناير، فسيصبح 28/29 فبراير
    if (expirationDate.getDate() !== currentDate.getDate()) {
      expirationDate.setDate(0); // آخر يوم في الشهر السابق
    }

    // تحويل التاريخ إلى تنسيق قاعدة البيانات (YYYY-MM-DD)
    const formattedExpirationDate = expirationDate.toISOString().split('T')[0];

    // البيانات المحدثة - فقط حالة الدفع وتاريخ الانتهاء
    const updatedData = {
      personalData_isPaidOffer: 1, // تغيير حالة الدفع إلى مدفوع
      personalData_expOffer: formattedExpirationDate // تحديث تاريخ الانتهاء
    };

    // تنفيذ عملية التحديث
    const result = await updateData(
      "personaldataregister",
      updatedData,
      "personalData_users_id = ?",
      [personalData_users_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Payment status updated successfully",
        data: {
          personalData_users_id: personalData_users_id,
          personalData_isPaidOffer: 1,
          personalData_expOffer: formattedExpirationDate,
          updated_at: new Date().toISOString(),
          message_ar: "تم تحديث حالة الدفع بنجاح"
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update payment status",
        message_ar: "فشل في تحديث حالة الدفع"
      });
    }

  } catch (error) {
    console.error("Error updating payment status: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating payment status",
      message_ar: "يوجد مشكلة في تحديث حالة الدفع",
      error: error.message
    });
  }
}

module.exports = { 
  updatePaymentStatus
};
