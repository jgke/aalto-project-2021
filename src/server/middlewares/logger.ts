import { Request, Response } from 'express';

export const logger = (
    req: Request,
    res: Response,
    next: (param?: unknown) => void
): void => {
    let body = req.body;

    if (body.password) {
        body = { ...body, password: '' };
    }

    const date: Date = new Date();
    console.table([
        {
            date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
            method: req.method,
            url: `${req.baseUrl}${req.url}`,
            body: body,
        },
    ]);
    next();
};
