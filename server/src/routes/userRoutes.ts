import express from "express";
import { createUser, getOrganizationDetails, } from "../controllers/userController";
import { authenticateUser } from "../authMiddleware";

const router = express.Router();

// Route to create a new user
router.post("/create-user", createUser);
router.get("/organization-details",authenticateUser, getOrganizationDetails);

export default router;