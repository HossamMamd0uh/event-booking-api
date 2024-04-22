import { Request, Response } from 'express';
import * as authService from '../services/authServices';

export const login = async (req: Request, res: Response) => {
    try {
        const token = await authService.login(req.body.email, req.body.password);
        res.json(token);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};