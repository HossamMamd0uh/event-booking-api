import express from 'express';
import * as categoryController from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of all categories
 */
router.get('/', authMiddleware, categoryController.getAllCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The created category
 */
router.post('/', authMiddleware, categoryController.createCategory);
export default router;