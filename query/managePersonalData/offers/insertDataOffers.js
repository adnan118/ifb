const {
  insertData
} = require("../../../controllers/functions");

async function insertDataOffers(req, res) {
  try {
    const { offers_titleEn, offers_titleAr, offers_price, offers_discount } = req.body;

    // التحقق من صحة البيانات
    if (!offers_titleEn || !offers_titleAr || !offers_price || !offers_discount) {
      return res.status(400).json({
        status: "failure",
        message: "All fields are required: offers_titleEn, offers_titleAr, offers_price, offers_discount"
      });
    }

    // إعداد بيانات الإدخال
    const insertOffersData = {
      offers_titleEn: offers_titleEn,
      offers_titleAr: offers_titleAr,
      offers_price: parseFloat(offers_price),
      offers_discount: parseFloat(offers_discount),
    };

    // إدخال البيانات في قاعدة البيانات
    const result = await insertData("offers", insertOffersData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Offer inserted successfully.",
        data: insertOffersData
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert offer.",
      });
    }
  } catch (error) {
    console.error("Error inserting offer: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting offer data",
    });
  }
}

// تصدير الدالة
module.exports = { insertDataOffers }; 