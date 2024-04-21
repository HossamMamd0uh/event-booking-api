import { Request, Response } from 'express';
import * as eventService from '../services/eventServices';
import { plainToInstance } from 'class-transformer';
import { CreateEventDTO } from '../dto/createEvent.dto';

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const eventData = plainToInstance(CreateEventDTO, req.body);
        await eventService.createEvent(eventData);
        res.status(201).json({ message: 'Event created'})
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await eventService.getEventById(parseInt(req.params.id));
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const filterEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.filterEvents(req.query);
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}