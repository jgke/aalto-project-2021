import { Request, Response } from 'express';

// Check to see if the requested route has the requested method as well
export const errorHandler = async (
    req: Request,
    res: Response,
    next: (param?: unknown) => void
): Promise<void> => {
    try {
        next();
    } catch (e) {
        console.log(e);
        res.status(500).json({});
    }
};
