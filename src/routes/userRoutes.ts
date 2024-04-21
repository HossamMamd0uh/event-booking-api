import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.get('/get-user-tickets/:userId', userController.getUsersTickets);

export default router;