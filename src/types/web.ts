import type { NextFunction, Request, Response, Router } from "express"

export interface Routes {
    [key: string]: {
        [key: string]: Router;
    }
}

export interface Middlewares {
    [key: string]: {
        [key: string]: (req: Request, res: Response, next: NextFunction) => Promise<any>;
    }
}