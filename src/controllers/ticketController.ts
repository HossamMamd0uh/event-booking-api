import { Request, Response } from 'express';
import * as ticketService from '../services/ticketServices';
import { errorCodes } from '../constants/errorCodes';

export const getTicketsByEventId = async (req: Request, res: Response) => {
    try {
        const tickets = await ticketService.getTicketsByEventId(parseInt(req.params.eventId));
        res.json(tickets);
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message , details: err.message});
    }
}

export const createTicket = async (req: Request, res: Response) => {
    try {
        await ticketService.createTicket(req.body);
        res.status(201).json({ message: 'Ticket created'})
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const getTicketById = async (req: Request, res: Response) => {
    try {
        const ticket = await ticketService.getTicketById(parseInt(req.params.id));
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(errorCodes.NOT_FOUND.code).json({ message: errorCodes.NOT_FOUND.message });
        }
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
};

export const reserveTicket = async (req: Request, res: Response) => {
    try {
        await ticketService.reserveTicket(parseInt(req.params.id) , parseInt(req.params.userId));
        res.json({ message: 'Ticket reserved' });
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
}

export const cancelTicketReservation = async (req: Request, res: Response) => {
    try {
        await ticketService.cancelTicketReservation(parseInt(req.params.id));
        res.json({ message: 'Ticket reservation canceled' });
    } catch (err) {
        res.status(errorCodes.BAD_REQUEST.code).json({ message: errorCodes.BAD_REQUEST.message, details: err.message });
    }
}