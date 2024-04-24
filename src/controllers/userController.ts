import { Request, Response } from 'express';
import * as userService from '../services/userServices';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({ message: 'User created'})
    } catch (err) {
        res.status(400).json({ message: 'Bad request', error: err.message});
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(parseInt(req.params.id));
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUsersTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await userService.getUsersTickets(parseInt(req.params.userId));
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
