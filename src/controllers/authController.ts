import { Request, Response } from 'express';
import * as authService from '../services/authServices';
import { errorCodes } from '../constants/errorCodes';

export const login = async (req: Request, res: Response) => {
    try {
        const token = await authService.login(req.body.email, req.body.password);
        res.json(token);
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};