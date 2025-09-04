// routes/routes.js
const express = require("express");
const { getDataCoupon } = require("../../query/coupon/getDataCoupon");
const { deleteDataCoupon } = require("../../query/coupon/deleteDataCoupon");
const { insertDataCoupon } = require("../../query/coupon/insertDataCoupon");
const { updateDataCoupon } = require("../../query/coupon/updateDataCoupon");
const { useDataCoupon } = require("../../query/coupon/useDataCoupon");
const { getAllCoupons } = require("../../query/coupon/getAllCoupons");


const router = express.Router();
// Coupon Usage Routes
const { getDataCouponUsage } = require("../../query/coupon_usage/getDataCouponUsage");
const { deleteDataCouponUsage } = require("../../query/coupon_usage/deleteDataCouponUsage");
const { insertDataCouponUsage } = require("../../query/coupon_usage/insertDataCouponUsage");
const { updateDataCouponUsage } = require("../../query/coupon_usage/updateDataCouponUsage");
const { useDataCouponUsage } = require("../../query/coupon_usage/useDataCouponUsage");

router.post("/getDataCoupon", getDataCoupon);
router.post("/deleteDataCoupon", deleteDataCoupon);

router.post("/getAllCoupons", getAllCoupons);
router.post("/insertDataCoupon", insertDataCoupon);
router.post("/updateDataCoupon", updateDataCoupon);
router.post("/useDataCoupon", useDataCoupon);

 
// Coupon Usage Routes
router.post("/getDataCouponUsage", getDataCouponUsage);
router.post("/deleteDataCouponUsage", deleteDataCouponUsage);
router.post("/insertDataCouponUsage", insertDataCouponUsage);
router.post("/updateDataCouponUsage", updateDataCouponUsage);
router.post("/useDataCouponUsage", useDataCouponUsage);


module.exports = router;



