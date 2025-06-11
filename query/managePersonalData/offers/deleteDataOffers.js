const {
  deleteData,
  getData
} = require("../../../controllers/functions");

async function deleteDataOffers(req, res) {
  try {
    const { offers_id } = req.body;

    // التحقق من وجود العرض
    const existingOffer = await getData("offers", "offers_id = ?", [offers_id]);
    if (!existingOffer || existingOffer.status !== "success" || !existingOffer.data) {
      return res.status(404).json({
        status: "failure",
        message: "Offer not found"
      });
    }

    const result = await deleteData("offers", "offers_id = ?", [
      offers_id,
    ]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Offer deleted successfully.",
        data: {
          offers_id,
          ...existingOffer.data
        }
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete offer.",
      });
    }
  } catch (error) {
    console.error("Error deleting offer: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting offer data",
    });
  }
}

// تصدير الدالة
module.exports = { deleteDataOffers }; 