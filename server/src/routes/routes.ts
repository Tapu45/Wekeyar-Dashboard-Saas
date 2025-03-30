import { Router } from "express";

const router = Router();
import {
  getSummary,
  getNonBuyingCustomers,
  getNonBuyingMonthlyCustomers,
  getCustomerReport,
  getStoreWiseSalesReport,
  getAllCustomers,
  getInactiveCustomers,
  getBillDetailsByBillNo,
} from "../controllers/reportController";
import { authenticateUser } from "../authMiddleware";


router.get("/summary",authenticateUser,getSummary);
router.get("/non-buying-customers",authenticateUser, getNonBuyingCustomers);
router.get("/non-buying-monthly-customers",authenticateUser, getNonBuyingMonthlyCustomers);
router.get("/customer-report",authenticateUser, getCustomerReport);
router.get("/store-sales-report",authenticateUser, getStoreWiseSalesReport);
router.get("/customers", getAllCustomers);
router.get("/inactive-customers",authenticateUser, getInactiveCustomers);
router.get("/bills/:billNo", getBillDetailsByBillNo);

export default router;
