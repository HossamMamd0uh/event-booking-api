import express from 'express';
import * as ticketController from '../controllers/ticketController';

const router = express.Router();

router.get('/get-ticket-by-event-id/:eventId', ticketController.getTicketsByEventId);
router.post('/', ticketController.createTicket);
router.post('/reserve/:id/:userId', ticketController.reserveTicket);
router.get('/:id', ticketController.getTicketById);
router.post('/cancel-reservation/:id', ticketController.cancelTicketReservation);

export default router;