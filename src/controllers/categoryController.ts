import { Request, Response } from 'express';
import * as categoryService from '../services/categoryServices';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        await categoryService.createCategory(req.body);
        res.status(201).json({ message: 'Category created'})
    } catch (err) {
        res.status(400).json({ message: 'Bad request' });
    }
};



