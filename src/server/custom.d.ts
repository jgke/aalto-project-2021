// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Express {
    export interface Request {
        token?: string;
        user?: { email: string; id: string; iat: number };
    }
}
