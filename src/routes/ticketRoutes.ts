import express from 'express';
import * as ticketController from '../controllers/ticketController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

/**
 * @swagger
 * /tickets/get-ticket-by-event-id/{eventId}:
 *   get:
 *     summary: Get tickets by event ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The list of all tickets for the event
 */
router.get('/get-ticket-by-event-id/:eventId', authMiddleware, ticketController.getTicketsByEventId);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: The created ticket
 */
router.post('/', authMiddleware,  ticketController.createTicket);

/**
 * @swagger
 * /tickets/reserve/{id}/{userId}:
 *   post:
 *     summary: Reserve a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The reserved ticket
 */
router.post('/reserve/:id/:userId', authMiddleware, ticketController.reserveTicket);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
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
 *         description: The ticket with the provided ID
 */
router.get('/:id', authMiddleware, ticketController.getTicketById);

/**
 * @swagger
 * /tickets/cancel-reservation/{id}:
 *   post:
 *     summary: Cancel a ticket reservation
 *     tags: [Tickets]
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
 *         description: The cancelled ticket reservation
 */
router.post('/cancel-reservation/:id', authMiddleware, ticketController.cancelTicketReservation);

export default router;