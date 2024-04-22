import express from 'express';
import * as eventController from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/', authMiddleware, eventController.getAllEvents);
router.post('/', authMiddleware, eventController.createEvent);
router.get('/filter', authMiddleware, eventController.filterEvents);
router.get('/:id', authMiddleware, eventController.getEventById);


export default router;