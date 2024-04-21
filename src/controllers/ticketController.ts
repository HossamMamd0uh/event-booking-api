import { Request, Response } from 'express';
import * as ticketService from '../services/ticketServices';

export const getTicketsByEventId = async (req: Request, res: Response) => {
    try {
        const tickets = await ticketService.getTicketsByEventId(parseInt(req.params.eventId));
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const createTicket = async (req: Request, res: Response) => {
    try {
        const createdTicket = await ticketService.createTicket(req.body);
        res.status(201).json({ message: 'Ticket created'})
    } catch (err) {
        res.status(400).json({ message: 'Bad request' });
    }
};

export const getTicketById = async (req: Request, res: Response) => {
    try {
        const ticket = await ticketService.getTicketById(parseInt(req.params.id));
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const reserveTicket = async (req: Request, res: Response) => {
    try {
        await ticketService.reserveTicket(parseInt(req.params.id) , parseInt(req.params.userId));
        res.json({ message: 'Ticket reserved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const cancelTicketReservation = async (req: Request, res: Response) => {
    try {
        await ticketService.cancelTicketReservation(parseInt(req.params.id));
        res.json({ message: 'Ticket reservation canceled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}