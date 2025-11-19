const {
  updateData,
  getData
} = require("../../../controllers/functions");

async function updateDataOffers(req, res) {
  try {
    const {
      offers_id,
      offers_titleEn,
      offers_titleAr,
      offers_price,
      offers_discount
    } = req.body;

    // التحقق من وجود العرض
    const existingOffer = await getData("offers", "offers_id = ?", [offers_id]);
    if (!existingOffer || existingOffer.status !== "success" || !existingOffer.data) {
      return res.status(404).json({
        status: "failure",
        message: "Offer not found"
      });
    }

    // التحقق من صحة البيانات
    if (!offers_titleEn || !offers_titleAr || !offers_price || !offers_discount) {
      return res.status(400).json({
        status: "failure",
        message: "All fields are required: offers_titleEn, offers_titleAr, offers_price, offers_discount"
      });
    }

    const updateOffersData = {
      offers_titleEn,
      offers_titleAr,
      offers_price: parseFloat(offers_price),
      offers_discount: parseFloat(offers_discount)
    };

    const result = await updateData(
      "offers",
      updateOffersData,
      "offers_id = ?",
      [offers_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Offer updated successfully.",
        data: {
          offers_id,
          ...updateOffersData
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update offer.",
      });
    }
  } catch (error) {
    console.error("Error updating offer: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating offer data",
    });
  }
}

// تصدير الدالة
module.exports = { updateDataOffers }; 