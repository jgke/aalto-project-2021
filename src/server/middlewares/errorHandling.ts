import { Request, Response } from 'express';

// Check to see if the requested route has the requested method as well
export const errorHandler = (
    req: Request,
    res: Response,
    next: (param?: unknown) => void
): void => {
    try {
        console.log('I am middleware')
        next()
    } catch (e) {
        console.log('Error from middleware!!')
        console.log(e)
    }
};
