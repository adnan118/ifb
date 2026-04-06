// routes/routes.js
const express = require("express");
// START ADDED: admin-only protection for coupon management routes
const { requireAdmin, requireAuth } = require("../../middleware/auth");
// END ADDED: admin-only protection for coupon management routes
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
// START ADDED: protect coupon write routes with bearer token
router.post("/deleteDataCoupon", requireAdmin, deleteDataCoupon);

router.post("/getAllCoupons", getAllCoupons);
router.post("/insertDataCoupon", requireAdmin, insertDataCoupon);
router.post("/updateDataCoupon", requireAdmin, updateDataCoupon);
router.post("/useDataCoupon", requireAuth, useDataCoupon);
// END ADDED: protect coupon write routes with bearer token

 
// Coupon Usage Routes
router.post("/getDataCouponUsage", getDataCouponUsage);
// START ADDED: protect coupon usage write routes with bearer token
router.post("/deleteDataCouponUsage", requireAdmin, deleteDataCouponUsage);
router.post("/insertDataCouponUsage", requireAdmin, insertDataCouponUsage);
router.post("/updateDataCouponUsage", requireAdmin, updateDataCouponUsage);
router.post("/useDataCouponUsage", requireAdmin, useDataCouponUsage);
// END ADDED: protect coupon usage write routes with bearer token


module.exports = router;





/*
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
*/


