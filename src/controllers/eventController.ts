import { Request, Response } from 'express';
import * as eventService from '../services/eventServices';
import { plainToInstance } from 'class-transformer';
import { CreateEventDTO } from '../dto/createEvent.dto';
import { errorCodes } from '../constants/errorCodes';

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents();
        res.json(events);
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const eventData = plainToInstance(CreateEventDTO, req.body);
        await eventService.createEvent(eventData);
        res.status(201).json({ message: 'Event created'})
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await eventService.getEventById(parseInt(req.params.id));
        if (event) {
            res.json(event);
        } else {
            res.status(errorCodes.NOT_FOUND.code).json({ message: errorCodes.NOT_FOUND.message });
        }
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const filterEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.filterEvents(req.query);
        res.json(events);
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
}