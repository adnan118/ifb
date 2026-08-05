/*
 * ============================================================================
 * نسخ قديمة من getDataFood (بدون ترقيم صفحات) حُذفت لإفساح المجال للنسخة
 * المحدّثة بالأسفل مع دعم Pagination وحالة الخطة (free / expired / active).
 * ============================================================================
 */

const { getData, getAllDataPaginated } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

// حد عرض الوجبات للخطط المجانية أو المنتهية الصلاحية
const FREE_PLAN_LIMIT = 3;

/**
 * دالة إرسال قائمة طعام مع ترقيم صفحات مع حد أقصى 3 عناصر للخطط غير النشطة
 */
async function sendFoodPage(res, table, where, values, orderBy, page, planStatus) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const effectiveLimit = FREE_PLAN_LIMIT;
  const offset = (safePage - 1) * effectiveLimit;

  if (offset >= FREE_PLAN_LIMIT) {
    return res.status(200).json({
      status: "success",
      message: "Food fetched successfully",
      data: [],
      page: safePage,
      limit: effectiveLimit,
      total: 0,
      hasMore: false,
      planStatus,
      freeLimit: FREE_PLAN_LIMIT,
    });
  }

  const result = await getAllDataPaginated(table, where, values, safePage, effectiveLimit, orderBy);
  if (result.status !== "success") {
    return res.status(500).json({
      status: "failure",
      message: result.message || "Error fetching food",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Food fetched successfully",
    data: result.data,
    page: result.page,
    limit: effectiveLimit,
    total: result.total,
    hasMore: false,
    planStatus,
    freeLimit: FREE_PLAN_LIMIT,
  });
}

/**
 * دالة جلب بيانات الطعام للمستخدم بناءً على حالة الأوفر مع دعم الترقيم (Pagination)
 * إذا كانت الخطة نشطة (أوفر ساري) يتم جلب الطعام المخصص له من user_foods مع ترقيم كامل
 * إذا كانت الخطة مجانية أو منتهية الصلاحية يتم جلب الطعام العام مع عرض 3 عناصر فقط
 * @param req - يجب أن يحتوي على user_id دائماً، و food_diettype_id إذا لم يكن هناك أوفر
 */
const getDataFood = async (req, res) => {
  try {
    const { food_diettype_id, user_id } = req.body;
    const page = Math.max(1, parseInt(req.body.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.body.limit, 10) || 10));

    // تحقق من وجود user_id (مستخدم ضيف)
    if (!user_id) {
      // إذا لم يوجد user_id -> خطة مجانية -> 3 عناصر فقط
      if (!food_diettype_id) {
        return res.status(400).json({
          status: "failure",
          message: "food_diettype_id is required",
        });
      }
      return sendFoodPage(res, "food", "food_diettype_id = ?", [food_diettype_id], "food_id", page, "free");
    }

    // 1. جلب بيانات المستخدم من personaldataregister
    const userDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [user_id]
    );
    if (userDataResult.status !== "success" || !userDataResult.data) {
      return res.status(404).json({
        status: "failure",
        message: "User personal data not found",
      });
    }
    const userData = userDataResult.data;
    const offers_id = userData.personalData_offers_id;
    const personalData_expOffer = userData.personalData_expOffer; // تاريخ انتهاء صلاحية الأوفر (إن وجد)
    const user_food_diettype_id = userData.personalData_dietType_id;

    // 2. جلب بيانات الأوفر من جدول offers لمعرفة قيمة الخصم
    let offers_discount = 0;
    if (offers_id) {
      const offerResult = await getData("offers", "offers_id = ?", [offers_id]);
      if (offerResult.status === "success" && offerResult.data) {
        offers_discount = offerResult.data.offers_discount || 0;
      }
    }

    // 2.1 التحقق من انتهاء صلاحية الأوفر من personalData_expOffer
    let isOfferExpired = false;
    if (personalData_expOffer) {
      const expDate = new Date(personalData_expOffer);
      if (!isNaN(expDate.getTime())) {
        isOfferExpired = Date.now() > expDate.getTime();
      }
    }

    // 3. تحديد حالة الخطة
    //offers_id = 2 ->  Training & Diet
    //offers_id = 4 ->  Diet
    const hasDietPlan = offers_discount && offers_discount !== 0 && (offers_id === 2 || offers_id === 4);
    let planStatus = "free";
    if (hasDietPlan) {
      planStatus = isOfferExpired ? "expired" : "active";
    }

    // 4. تنفيذ الجلب حسب حالة الخطة
    if (planStatus === "active") {
      // --- المستخدم لديه خطة فعالة وغير منتهية ---
      // نجلب الطعام المخصص له من جدول user_foods مع ترقيم
      const connection = await getConnection();
      try {
        const [countRows] = await connection.execute(
          "SELECT COUNT(*) AS total FROM user_foods uf WHERE uf.user_id = ?",
          [user_id]
        );
        const total = countRows[0].total;
        const offset = (page - 1) * limit;
        const [userFoods] = await connection.execute(
          `SELECT uf.*, f.* FROM user_foods uf JOIN food f ON uf.food_id = f.food_id WHERE uf.user_id = ? ORDER BY f.food_id LIMIT ${limit} OFFSET ${offset}`,
          [user_id]
        );
        await connection.end();

        return res.status(200).json({
          status: "success",
          message: "User foods fetched successfully (خصم فعال)",
          data: userFoods,
          page,
          limit,
          total,
          hasMore: offset + userFoods.length < total,
          planStatus,
        });
      } catch (error) {
        await connection.end();
        console.error("Error in user_foods query:", error);
        return res.status(500).json({
          status: "failure",
          message: "Error fetching user foods",
          error: error.message,
        });
      }
    }

    // --- خطة مجانية أو منتهية الصلاحية -> جلب عام مع حد 3 عناصر ---
    if (!user_food_diettype_id) {
      return res.status(400).json({
        status: "failure",
        message: "personalData_dietType_id is required in user data",
      });
    }
    return sendFoodPage(res, "food", "food_diettype_id = ?", [user_food_diettype_id], "food_id", page, planStatus);
  } catch (error) {
    // معالجة أي خطأ غير متوقع
    console.error("Error in getDataFood:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataFood,
};
