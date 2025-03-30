"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../authMiddleware");
router.get("/summary", authMiddleware_1.authenticateUser, reportController_1.getSummary);
router.get("/non-buying-customers", authMiddleware_1.authenticateUser, reportController_1.getNonBuyingCustomers);
router.get("/non-buying-monthly-customers", authMiddleware_1.authenticateUser, reportController_1.getNonBuyingMonthlyCustomers);
router.get("/customer-report", authMiddleware_1.authenticateUser, reportController_1.getCustomerReport);
router.get("/store-sales-report", authMiddleware_1.authenticateUser, reportController_1.getStoreWiseSalesReport);
router.get("/customers", reportController_1.getAllCustomers);
router.get("/inactive-customers", authMiddleware_1.authenticateUser, reportController_1.getInactiveCustomers);
router.get("/bills/:billNo", reportController_1.getBillDetailsByBillNo);
exports.default = router;
//# sourceMappingURL=routes.js.map