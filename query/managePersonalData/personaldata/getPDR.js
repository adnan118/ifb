const { getData } = require("../../../controllers/functions");
// START ADDED: expose parsed arrays while keeping original DB fields unchanged
const {
  attachMultiSelectArrays,
} = require("../../../controllers/personalDataMultiSelect");
// END ADDED: expose parsed arrays while keeping original DB fields unchanged

async function getPDR(req, res) {
  try {
    const { personalData_users_id } = req.body;

    const result = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id]
    );

    if (result.status === "success") {
      // START ADDED: keep original CSV fields and add derived array fields
      res.status(200).json({
        status: "success",
        data: attachMultiSelectArrays(result.data),
      });
      // END ADDED: keep original CSV fields and add derived array fields
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to get data.",
      });
    }
  } catch (error) {
    console.error("Error getting data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem getting data",
    });
  }
}

module.exports = { getPDR };

/*
const { getData } = require("../../../controllers/functions");

 async function getPDR(req, res) {
  try {
    const { personalData_users_id } = req.body;

     const result = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id], 
    );
 
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success", 
        data: result.data,
      });
    }
    
    else {
      res.status(500).json({
        status: "failure",
        message: "Failed to get data.",
      });
    }
  } catch (error) {
    console.error("Error getting data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem getting data",
    });
  }
}
// تصدير الدالة
module.exports = { getPDR };
*/
