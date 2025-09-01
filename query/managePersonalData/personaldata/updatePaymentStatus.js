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
const { getData, updateData, insertData } = require("../../../controllers/functions");

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
        message: "Payment is already completed",
        message_ar: "تم الدفع مسبقاً"
      });
    }

    // التحقق من صحة الكوبون إذا كان موجوداً
    let couponValid = false;
    let couponDiscount = 0;
    
    if (currentData.personalData_coupon_id) {
      // جلب معلومات الكوبون
      const couponResult = await getData("coupon", "coupon_id = ?", [currentData.personalData_coupon_id]);
      
      if (couponResult.status === "success" && couponResult.data) {
        const coupon = couponResult.data;
        const nowDate = new Date().toISOString().split("T")[0];
        
        // التحقق من صلاحية الكوبون
        if (coupon.coupon_count > 0 && coupon.coupon_end >= nowDate && coupon.coupon_start <= nowDate) {
          // التحقق من عدم استخدام المستخدم للكوبون مسبقاً
          const usageResult = await getData(
            "coupon_usage", 
            "coupon_id = ? AND user_id = ?", 
            [currentData.personalData_coupon_id, personalData_users_id]
          );
          
          if (usageResult.status === "success" && (!usageResult.data || usageResult.data.length === 0)) {
            couponValid = true;
            couponDiscount = parseFloat(coupon.coupon_discount) || 0;
          } else {
            return res.status(400).json({
              status: "failure",
              message: "Coupon has already been used by this user",
              message_ar: "تم استخدام هذا الكوبون من قبل هذا المستخدم"
            });
          }
        } else {
          return res.status(400).json({
            status: "failure",
            message: "Coupon is invalid or expired",
            message_ar: "الكوبون غير صالح أو منتهي الصلاحية"
          });
        }
      } else {
        return res.status(400).json({
          status: "failure",
          message: "Invalid coupon",
          message_ar: "كوبون غير صحيح"
        });
      }
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
      // جلب معلومات العرض لحساب المبلغ
      let offerPrice = 0;
      let offerDiscount = 0;
      let netAmount = 0;
      
      if (currentData.personalData_offers_id) {
        const offerResult = await getData("offers", "offers_id = ?", [currentData.personalData_offers_id]);
        if (offerResult.status === "success" && offerResult.data) {
          offerPrice = parseFloat(offerResult.data.offers_price) || 0;
          offerDiscount = parseFloat(offerResult.data.offers_discount) || 0;
        }
      }
      
      // حساب المبلغ الصافي بعد الخصومات
      let totalDiscount = offerDiscount;
      if (couponValid) {
        totalDiscount += couponDiscount;
      }
      netAmount = offerPrice - (offerPrice * totalDiscount / 100);
      
      // إدراج سجل في جدول payments
      const paymentData = {
        payments_userid: personalData_users_id,
        payments_offerid: currentData.personalData_offers_id || null,
        payments_couponid: couponValid ? currentData.personalData_coupon_id : null,
        payments_amount: offerPrice,
        payments_amount_net: netAmount,
        payments_date: new Date()
      };

      const paymentResult = await insertData("payments", paymentData);
      
      if (paymentResult.status === "success") {
        res.json({
          status: "success",
          message: "Payment status updated and payment record created successfully",
          data: {
            personalData_users_id: personalData_users_id,
            personalData_isPaidOffer: 1,
            personalData_expOffer: formattedExpirationDate,
            payment_amount: offerPrice,
            payment_amount_net: netAmount,
            offer_discount: offerDiscount,
            coupon_discount: couponValid ? couponDiscount : 0,
            total_discount: totalDiscount,
            coupon_applied: couponValid,
            updated_at: new Date().toISOString(),
            message_ar: "تم تحديث حالة الدفع وإنشاء سجل الدفعة بنجاح"
          }
        });
      } else {
        // إذا فشل إدراج الدفعة، نعيد حالة الدفع كما كانت
        await updateData(
          "personaldataregister",
          { personalData_isPaidOffer: 0, personalData_expOffer: currentData.personalData_expOffer },
          "personalData_users_id = ?",
          [personalData_users_id]
        );
        
        res.status(500).json({
          status: "failure",
          message: "Payment status updated but failed to create payment record. Changes reverted.",
          message_ar: "تم تحديث حالة الدفع لكن فشل في إنشاء سجل الدفعة. تم التراجع عن التغييرات"
        });
      }
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
