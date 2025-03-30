import { Router } from "express";
const router = Router();
import { checkAuth, login, logout, signupOrganization } from "../controllers/authController";

router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", checkAuth);
router.post("/signup-organization", signupOrganization);

export default router;