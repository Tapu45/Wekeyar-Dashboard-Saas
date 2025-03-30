import { Request, Response } from "express";
import { CustomRequest } from "../authMiddleware";
export declare const createUser: (req: Request, res: Response) => Promise<void>;
export declare const getOrganizationDetails: (req: CustomRequest, res: Response) => Promise<void>;
