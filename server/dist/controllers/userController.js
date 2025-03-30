"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationDetails = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
            },
        });
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            res.status(409).json({ error: "Username or email already exists" });
            return;
        }
        res.status(500).json({ error: "Failed to create user" });
    }
};
exports.createUser = createUser;
const getOrganizationDetails = async (req, res) => {
    const { tenantId } = req.user;
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: {
                name: true,
                logo: true,
                employeeSize: true,
                numberOfStores: true,
                mainOfficeAddress: true,
            },
        });
        if (!tenant) {
            res.status(404).json({ error: "Organization not found" });
            return;
        }
        res.status(200).json(tenant);
    }
    catch (error) {
        console.error("Error fetching organization details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getOrganizationDetails = getOrganizationDetails;
//# sourceMappingURL=userController.js.map