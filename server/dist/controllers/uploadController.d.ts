import { Request, Response } from 'express';
export declare const uploadExcelFile: (req: Request, res: Response) => Promise<void>;
export declare const getUploadHistory: (req: Request, res: Response) => Promise<void>;
export declare const deleteUploadHistory: (req: Request, res: Response) => Promise<void>;
export declare const getUploadStatus: (req: Request, res: Response) => Promise<void>;
