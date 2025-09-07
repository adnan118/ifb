/*const { getData, updateData } = require("../../../controllers/functions");

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
*/ 


const { getConnection } = require("../../../controllers/db");

// دالة لتعديل حالة الدفع وتحديث تاريخ الانتهاء + إدراج سجل في جدول الدفعات payments
async function updatePaymentStatus(req, res) {
  let connection;
  try {
    const { personalData_users_id, payments_amount, payments_amount_net } =
      req.body;

    // التحقق من وجود معرف المستخدم
    if (!personalData_users_id) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required",
      });
    }

    // التحقق من مبلغ الدفع إذا كان مطلوباً للإدراج
    if (payments_amount === undefined || payments_amount === null) {
      return res.status(400).json({
        status: "failure",
        message: "payments_amount ,payments_amount_net is required",
      });
    }

    connection = await getConnection();
    await connection.beginTransaction();

    // جلب البيانات الحالية للمستخدم
    const [rows] = await connection.execute(
      "SELECT * FROM personaldataregister WHERE personalData_users_id = ?",
      [personalData_users_id]
    );

    if (!rows || rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: "failure",
        message: "User not found",
      });
    }

    const currentData = rows[0];

    // التحقق من أن حالة الدفع الحالية ليست مدفوعة مسبقاً
    if (Number(currentData.personalData_isPaidOffer) === 1) {
      await connection.rollback();
      return res.status(400).json({
        status: "failure",
        message: "Payment is already completed",
      });
    }

    // حساب تاريخ الانتهاء الجديد (شهر واحد من الآن) مع معالجة اختلاف أطوال الشهور
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    const currentDay = currentDate.getDate();
    expirationDate.setMonth(expirationDate.getMonth() + 1);
    if (expirationDate.getDate() !== currentDay) {
      // إذا حدث تجاوز، اضبط ليكون آخر يوم في الشهر السابق
      expirationDate.setDate(0);
    }

    const formattedExpirationDate = expirationDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // تحديث حالة الدفع وتاريخ الانتهاء في personaldataregister
    await connection.execute(
      "UPDATE personaldataregister SET personalData_isPaidOffer = ?, personalData_expOffer = ? WHERE personalData_users_id = ?",
      [1, formattedExpirationDate, personalData_users_id]
    );

    // تجهيز بيانات الإدراج في جدول الدفعات payments
    // الأعمدة المتاحة حسب توضيحك: payments_id, payments_userid, payments_offerid, payments_couponid, payments_amount, payments_amount_net, payments_date
    const payments_userid = personalData_users_id;
    const payments_offerid = currentData.personalData_offers_id || null; // إن وُجد
    const payments_couponid = (req.body && req.body.payments_couponid != null) ? Number(req.body.payments_couponid) : 11; // افتراضي 0 إذا كان الحقل NOT NULL
     const payments_date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    await connection.execute(
      "INSERT INTO payments (payments_userid, payments_offerid, payments_couponid, payments_amount, payments_amount_net, payments_date) VALUES (?, ?, ?, ?, ?, ?)",
      [
        payments_userid,
        payments_offerid,
        payments_couponid,
        payments_amount,
        payments_amount_net,
        payments_date,
      ]
    );

    await connection.commit();

    return res.json({
      status: "success",
      message: "Payment status updated and payment recorded successfully",
      data: {
        personalData_users_id,
        personalData_isPaidOffer: 1,
        personalData_expOffer: formattedExpirationDate,
        payment: {
          payments_userid,
          payments_offerid,
          payments_couponid,
          payments_amount,
          payments_amount_net,
          payments_date,
        },
        updated_at: new Date().toISOString(),
        message_ar: "تم تحديث حالة الدفع وإضافة الدفعة بنجاح",
      },
    });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch (_) {}
    }
    console.error("Error updating payment status: ", error);
    return res.status(500).json({
      status: "failure",
      message: "There is a problem updating payment status and recording payment",
      message_ar: "يوجد مشكلة في تحديث حالة الدفع وتسجيل الدفعة",
      error: error.message,
    });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

module.exports = {
  updatePaymentStatus,
};
 
