import { Request, Response } from 'express';
import * as userService from '../services/userServices';
import { errorCodes } from '../constants/errorCodes';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        await userService.createUser(req.body);
        res.status(201).json({ message: 'User created'})
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.code, details: err.message});
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(parseInt(req.params.id));
        if (user) {
            res.json(user);
        } else {
            res.status(errorCodes.NOT_FOUND.code).json({ message: errorCodes.NOT_FOUND.message });
        }
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const getUsersTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await userService.getUsersTickets(parseInt(req.params.userId));
        res.json(tickets);
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
}
