import express from 'express';
import * as eventController from '../controllers/eventController';

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);
router.get('/filter', eventController.filterEvents);
router.get('/:id', eventController.getEventById);


export default router;