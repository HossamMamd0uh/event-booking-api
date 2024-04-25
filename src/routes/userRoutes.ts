import express from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of all users
 */
router.get('/', authMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 format: name
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               name: test
 *               email: testemail@email.com
 *               password: Password@123
 *     responses:
 *       200:
 *         description: The created user
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The user
 *       404:
 *         description: User not found
 */
router.get('/:id', authMiddleware, userController.getUserById);

/**
 * @swagger
 * /users/get-user-tickets/{userId}:
 *   get:
 *     summary: Get all tickets for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The list of all tickets for the user
 */
router.get('/get-user-tickets/:userId', authMiddleware, userController.getUsersTickets);

export default router;