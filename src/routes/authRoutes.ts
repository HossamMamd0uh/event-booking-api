import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The authentication token
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.login);

export default router;