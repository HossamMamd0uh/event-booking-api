import { Request, Response } from 'express';
import * as categoryService from '../services/categoryServices';
import { errorCodes } from '../constants/errorCodes';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        await categoryService.createCategory(req.body);
        res.status(201).json({ message: 'Category created'})
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};



