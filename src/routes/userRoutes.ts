import express from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', authMiddleware, userController.getUserById);
router.get('/get-user-tickets/:userId', authMiddleware, userController.getUsersTickets);

export default router;