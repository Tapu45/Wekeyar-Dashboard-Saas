"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadStatus = exports.deleteUploadHistory = exports.getUploadHistory = exports.uploadExcelFile = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const Websocket_1 = require("../utils/Websocket");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const prisma = new client_1.PrismaClient();
const uploadExcelFile = async (req, res) => {
    try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            throw new Error("Tenant ID is required to upload files.");
        }
        if (!req.file) {
            console.error("No file uploaded.");
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const file = req.file;
        const fileName = req.file.originalname;
        console.log("Uploading file to Cloudinary...");
        const cloudinaryResult = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({ folder: "uploads", resource_type: "raw" }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
            stream.end(file.buffer);
        });
        console.log("File uploaded to Cloudinary:", cloudinaryResult.secure_url);
        const uploadHistory = await prisma.uploadHistory.create({
            data: {
                fileName,
                fileUrl: cloudinaryResult.secure_url,
                status: "in-progress",
                tenantId,
            },
        });
        const workerPath = path_1.default.resolve(__dirname, "./excelProccessor.js");
        if (!fs_1.default.existsSync(workerPath)) {
            console.error(`Worker file does not exist at: ${workerPath}`);
            res.status(500).json({ error: "Worker file not found" });
            await prisma.uploadHistory.update({
                where: { id: uploadHistory.id },
                data: { status: "failed" },
            });
            return;
        }
        const worker = new worker_threads_1.Worker(workerPath, {
            workerData: { fileUrl: cloudinaryResult.secure_url, tenantId },
        });
        worker.on("message", async (message) => {
            if (message.status === "progress") {
                console.log(`Received progress update from worker: ${message.progress}%`);
                (0, Websocket_1.broadcastProgress)(message.progress);
            }
            else if (message.status === "completed") {
                await prisma.uploadHistory.update({
                    where: { id: uploadHistory.id },
                    data: { status: "completed" },
                });
                (0, Websocket_1.broadcastCompletion)("completed", message.stats);
                res.status(200).json({
                    success: true,
                    message: "File processed successfully",
                    stats: message.stats || {},
                });
            }
            else if (message.status === "error") {
                await prisma.uploadHistory.update({
                    where: { id: uploadHistory.id },
                    data: { status: "failed" },
                });
                (0, Websocket_1.broadcastCompletion)("error", null, message.error);
                res.status(500).json({
                    success: false,
                    message: message.error,
                });
            }
        });
        worker.on("error", async (error) => {
            console.error("Worker error:", error);
            await prisma.uploadHistory.update({
                where: { id: uploadHistory.id },
                data: { status: "failed" },
            });
            (0, Websocket_1.broadcastCompletion)("error", null, error.message);
            res.status(500).json({
                success: false,
                message: "Error processing file",
            });
        });
        worker.on("exit", async (code) => {
            if (code !== 0) {
                console.error(`Worker exited with code ${code}. Marking upload as failed.`);
                await prisma.uploadHistory.update({
                    where: { id: uploadHistory.id },
                    data: { status: "failed" },
                });
                (0, Websocket_1.broadcastCompletion)("error", null, "Worker thread exited unexpectedly.");
            }
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Error uploading file" });
    }
};
exports.uploadExcelFile = uploadExcelFile;
const getUploadHistory = async (req, res) => {
    try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
            throw new Error("Tenant ID is required to fetch upload history.");
        }
        const history = await prisma.uploadHistory.findMany({
            where: { tenantId },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(history);
    }
    catch (error) {
        console.error("Error fetching upload history:", error);
        res.status(500).json({ error: "Failed to fetch upload history" });
    }
};
exports.getUploadHistory = getUploadHistory;
const deleteUploadHistory = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId)) {
                res.status(400).json({ error: "Invalid ID format" });
                return;
            }
            const deletedRecord = await prisma.uploadHistory.delete({
                where: { id: parsedId },
            });
            res.status(200).json({ message: "Upload history record deleted successfully", deletedRecord });
        }
        else {
            await prisma.uploadHistory.deleteMany();
            res.status(200).json({ message: "All upload history records deleted successfully" });
        }
    }
    catch (error) {
        console.error("Error deleting upload history:", error);
        res.status(500).json({ error: "Failed to delete upload history" });
    }
};
exports.deleteUploadHistory = deleteUploadHistory;
const getUploadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadHistory = await prisma.uploadHistory.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!uploadHistory) {
            res.status(404).json({ error: "Upload not found" });
            return;
        }
        res.status(200).json(uploadHistory);
    }
    catch (error) {
        console.error("Error fetching upload status:", error);
        res.status(500).json({ error: "Error fetching upload status" });
    }
};
exports.getUploadStatus = getUploadStatus;
//# sourceMappingURL=uploadController.js.map