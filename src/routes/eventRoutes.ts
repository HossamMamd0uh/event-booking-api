import express from 'express';
import * as eventController from '../controllers/eventController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of all events
 */
router.get('/', authMiddleware, eventController.getAllEvents);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the event
 *                 example: My Event
 *               description:
 *                 type: string
 *                 description: The description of the event
 *                 example: This is my event
 *               availableAttendeesCount:
 *                 type: integer
 *                 description: The number of available attendees for the event
 *                 example: 100
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event
 *                 example: '2022-12-31T23:59:59Z'
 *               category:
 *                 type: integer
 *                 description: The category ID of the event
 *                 example: 1
 *     responses:
 *       200:
 *         description: The created event
 */
router.post('/', authMiddleware, eventController.createEvent);

/**
 * @swagger
 * /events/filter:
 *   get:
 *     summary: Filter events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: The ID of the category to filter by
 *         example: 1
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the event to filter by
 *         example: 'event 1'
 *     responses:
 *       200:
 *         description: The list of filtered events
 */
router.get('/filter', authMiddleware, eventController.filterEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
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
 *         description: The event with the provided ID
 */
router.get('/:id', authMiddleware, eventController.getEventById);


export default router;