import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from "../config/config";
import { errorCodes } from '../constants/errorCodes';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(errorCodes.NOT_AUTHORIZED.code).json({ message: errorCodes.NOT_AUTHORIZED.message });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        req.body.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(errorCodes.INVALID_TOKEN.code).json({ message: errorCodes.INVALID_TOKEN.message, details: err.message});
    }
};