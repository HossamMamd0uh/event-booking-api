import express from 'express';
import * as ticketController from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.get('/get-ticket-by-event-id/:eventId', authMiddleware, ticketController.getTicketsByEventId);
router.post('/', authMiddleware,  ticketController.createTicket);
router.post('/reserve/:id/:userId', authMiddleware, ticketController.reserveTicket);
router.get('/:id', authMiddleware, ticketController.getTicketById);
router.post('/cancel-reservation/:id', authMiddleware, ticketController.cancelTicketReservation);

export default router;