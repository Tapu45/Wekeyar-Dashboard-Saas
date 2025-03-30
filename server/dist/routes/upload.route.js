"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const uploadController_1 = require("../controllers/uploadController");
const authMiddleware_1 = require("../authMiddleware");
const router = express_1.default.Router();
router.post('/upload', authMiddleware_1.authenticateUser, (req, res, next) => {
    (0, middleware_1.uploadMiddleware)(req, res, (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(400).json({ error: err.message });
        }
        return next();
    });
}, uploadController_1.uploadExcelFile);
router.get('/upload/history', authMiddleware_1.authenticateUser, uploadController_1.getUploadHistory);
router.delete('/upload/history/:id?', authMiddleware_1.authenticateUser, uploadController_1.deleteUploadHistory);
router.get('/upload/status/:id', authMiddleware_1.authenticateUser, uploadController_1.getUploadStatus);
exports.default = router;
//# sourceMappingURL=upload.route.js.map