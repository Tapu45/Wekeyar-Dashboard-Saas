"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTelecallerRemarksOrders = exports.updateCustomerRemarks = exports.getTelecallersWithOrderCount = exports.getNewProducts = exports.getAllTelecallingOrders = exports.getTelecallingOrders = exports.saveTelecallingOrder = exports.getProducts = exports.getTelecallingCustomers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTelecallingCustomers = async (_req, res) => {
    try {
        const customers = await prisma.telecallingCustomer.findMany({
            where: {
                remarks: { not: null },
            },
            include: {
                orders: true,
            },
        });
        res.status(200).json(customers);
    }
    catch (error) {
        console.error("Error fetching telecalling customers:", error);
        res.status(500).json({ error: "Failed to fetch telecalling customers" });
    }
};
exports.getTelecallingCustomers = getTelecallingCustomers;
const getProducts = async (req, res) => {
    try {
        const { search } = req.query;
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};
exports.getProducts = getProducts;
const saveTelecallingOrder = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        if (!req.user) {
            res.status(403).json({ error: "Unauthorized. User not found." });
            return;
        }
        const { telecallingCustomerId, products, remarks } = req.body;
        const customerExists = await prisma.telecallingCustomer.findFirst({
            where: { customerId: telecallingCustomerId },
        });
        if (!customerExists) {
            res.status(400).json({ error: "Invalid telecallingCustomerId. Customer does not exist." });
            return;
        }
        const telecallerId = req.user.id;
        const order = await prisma.telecallingOrder.create({
            data: {
                telecallingCustomerId: customerExists.id,
                telecallerId,
                orderDetails: {
                    create: products.map((product) => ({
                        productName: product.productName,
                        quantity: product.quantity,
                        isNewProduct: product.isNewProduct,
                    })),
                },
            },
            include: {
                orderDetails: true,
            },
        });
        if (remarks) {
            await prisma.telecallingCustomer.update({
                where: { id: customerExists.id },
                data: { remarks },
            });
        }
        res.status(201).json(order);
    }
    catch (error) {
        console.error("Error saving telecalling order:", error);
        res.status(500).json({ error: "Failed to save telecalling order" });
    }
};
exports.saveTelecallingOrder = saveTelecallingOrder;
const getTelecallingOrders = async (_req, res) => {
    try {
        const orders = await prisma.telecallingOrder.findMany({
            include: {
                telecallingCustomer: true,
                orderDetails: true,
            },
        });
        const result = orders.map((order) => ({
            id: order.id,
            orderDate: order.orderDate,
            telecallingCustomer: {
                id: order.telecallingCustomer.id,
                customerName: order.telecallingCustomer.customerName,
                customerPhone: order.telecallingCustomer.customerPhone,
            },
            orderDetails: order.orderDetails.map((detail) => ({
                productName: detail.productName,
                quantity: detail.quantity,
                isNewProduct: detail.isNewProduct,
            })),
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching telecalling orders:", error);
        res.status(500).json({ error: "Failed to fetch telecalling orders" });
    }
};
exports.getTelecallingOrders = getTelecallingOrders;
const getAllTelecallingOrders = async (_req, res) => {
    try {
        const orders = await prisma.telecallingOrder.findMany({
            include: {
                telecallingCustomer: true,
                telecaller: true,
                orderDetails: true,
            },
            orderBy: {
                orderDate: "desc",
            },
        });
        const result = orders.map((order) => ({
            id: order.id,
            orderDate: order.orderDate,
            telecallingCustomer: {
                id: order.telecallingCustomer.id,
                customerName: order.telecallingCustomer.customerName,
                customerPhone: order.telecallingCustomer.customerPhone,
            },
            telecaller: {
                id: order.telecaller.id,
                username: order.telecaller.username,
                email: order.telecaller.email,
            },
            orderDetails: order.orderDetails.map((detail) => ({
                productName: detail.productName,
                quantity: detail.quantity,
                isNewProduct: detail.isNewProduct,
            })),
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching all telecalling orders:", error);
        res.status(500).json({ error: "Failed to fetch all telecalling orders" });
    }
};
exports.getAllTelecallingOrders = getAllTelecallingOrders;
const getNewProducts = async (_req, res) => {
    try {
        const newProducts = await prisma.telecallingOrderDetails.findMany({
            where: {
                isNewProduct: true,
            },
            include: {
                telecallingOrder: {
                    include: {
                        telecallingCustomer: true,
                        telecaller: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const result = newProducts.map((detail) => ({
            id: detail.id,
            productName: detail.productName,
            quantity: detail.quantity,
            orderDate: detail.telecallingOrder.orderDate,
            telecallingCustomer: {
                id: detail.telecallingOrder.telecallingCustomer.id,
                customerName: detail.telecallingOrder.telecallingCustomer.customerName,
                customerPhone: detail.telecallingOrder.telecallingCustomer.customerPhone,
            },
            telecaller: {
                id: detail.telecallingOrder.telecaller.id,
                username: detail.telecallingOrder.telecaller.username,
            },
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching new products:", error);
        res.status(500).json({ error: "Failed to fetch new products" });
    }
};
exports.getNewProducts = getNewProducts;
const getTelecallersWithOrderCount = async (_req, res) => {
    try {
        const telecallers = await prisma.user.findMany({
            where: { role: "tellecaller" },
            select: {
                id: true,
                username: true,
                email: true,
                _count: {
                    select: { telecallingOrders: true },
                },
            },
        });
        const result = telecallers.map(tc => ({
            id: tc.id,
            username: tc.username,
            email: tc.email,
            orderCount: tc._count.telecallingOrders,
        }));
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching telecallers with order count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getTelecallersWithOrderCount = getTelecallersWithOrderCount;
const updateCustomerRemarks = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;
        if (!remarks) {
            res.status(400).json({ error: "Remarks are required" });
            return;
        }
        const customer = await prisma.telecallingCustomer.findFirst({
            where: { customerId: Number(id) },
        });
        if (!customer) {
            res.status(404).json({ error: "Customer not found" });
            return;
        }
        const telecallerId = req.user?.id;
        if (!telecallerId) {
            res.status(403).json({ error: "Unauthorized. Telecaller ID not found." });
            return;
        }
        await prisma.telecallingCustomer.update({
            where: { id: customer.id },
            data: { remarks },
        });
        await prisma.telecallerHandledCustomer.create({
            data: {
                telecallerId,
                customerId: customer.id,
            },
        });
        res.status(200).json({ message: "Remarks updated and customer marked as handled." });
    }
    catch (error) {
        console.error("Error updating customer remarks:", error);
        res.status(500).json({ error: "Failed to update customer remarks" });
    }
};
exports.updateCustomerRemarks = updateCustomerRemarks;
const getTelecallerRemarksOrders = async (req, res) => {
    try {
        const telecallerId = req.user?.id;
        if (!telecallerId) {
            res.status(403).json({ error: "Unauthorized. Telecaller ID not found." });
            return;
        }
        const customers = await prisma.telecallingCustomer.findMany({
            where: {
                remarks: { not: null },
            },
            select: {
                id: true,
                customerName: true,
                customerPhone: true,
                remarks: true,
            },
        });
        const orders = await prisma.telecallingOrder.findMany({
            where: {
                telecallerId,
            },
            select: {
                telecallingCustomerId: true,
                id: true,
            },
        });
        const orderMap = new Map();
        orders.forEach((order) => {
            if (!orderMap.has(order.telecallingCustomerId)) {
                orderMap.set(order.telecallingCustomerId, []);
            }
            orderMap.get(order.telecallingCustomerId)?.push(order.id);
        });
        const result = customers.map((customer) => ({
            id: customer.id,
            customerName: customer.customerName,
            customerPhone: customer.customerPhone,
            remarks: customer.remarks || "No remarks",
            orderCount: orderMap.get(customer.id)?.length || 0,
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching telecaller remarks/orders:", error);
        res.status(500).json({ error: "Failed to fetch telecaller remarks/orders" });
    }
};
exports.getTelecallerRemarksOrders = getTelecallerRemarksOrders;
//# sourceMappingURL=tellicallingController.js.map