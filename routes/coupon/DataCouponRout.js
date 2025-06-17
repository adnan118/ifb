// routes/routes.js
const express = require("express");
const { getDataCoupon } = require("../../query/coupon/getDataCoupon");
const { deleteDataCoupon } = require("../../query/coupon/deleteDataCoupon");
const { insertDataCoupon } = require("../../query/coupon/insertDataCoupon");
const { updateDataCoupon } = require("../../query/coupon/updateDataCoupon");
const { useDataCoupon } = require("../../query/coupon/useDataCoupon");


 



const router = express.Router();

router.post("/getDataCoupon", getDataCoupon);
router.post("/deleteDataCoupon", deleteDataCoupon);


router.post("/insertDataCoupon", insertDataCoupon);
router.post("/updateDataCoupon", updateDataCoupon);
router.post("/useDataCoupon", useDataCoupon);

 

module.exports = router;
