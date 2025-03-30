import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const getSummary: (req: Request, res: Response) => Promise<void>;
export declare const getNonBuyingCustomers: (req: Request, res: Response) => Promise<void>;
export declare const getNonBuyingMonthlyCustomers: (req: Request, res: Response) => Promise<void>;
export declare const getCustomerReport: (req: Request, res: Response) => Promise<void>;
export declare const getStoreWiseSalesReport: (req: Request, res: Response) => Promise<void>;
export declare const getAllCustomers: (_req: Request, res: Response) => Promise<void>;
export declare const getInactiveCustomers: (req: Request, res: Response) => Promise<void>;
export declare const getBillDetailsByBillNo: (req: Request, res: Response) => Promise<void>;
