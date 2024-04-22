import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from "../config/config";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        req.body.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};