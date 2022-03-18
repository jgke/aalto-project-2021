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
    if (process.env.NODE_ENV !== 'test') {
        // eslint-disable-next-line no-console
        console.table([
            {
                date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
                method: req.method,
                url: `${req.baseUrl}${req.url}`,
                body: body,
            },
        ]);
    }
    next();
};
