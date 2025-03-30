"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../authMiddleware");
const router = express_1.default.Router();
router.post("/create-user", userController_1.createUser);
router.get("/organization-details", authMiddleware_1.authenticateUser, userController_1.getOrganizationDetails);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map