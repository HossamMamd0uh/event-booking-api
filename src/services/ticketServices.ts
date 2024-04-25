import { Ticket } from "../models/ticket";
import { Event } from "../models/event";
import { User } from "../models/user";
export const getTicketsByEventId = async (eventId: number) => {
    const event = await Event.findOneBy({ id: eventId });
    const tickets = await Ticket.findBy({ event: event });
    return tickets;
};

export const createTicket = async (ticketData: any) => {
    const newTicket = Ticket.create(ticketData);
    await Ticket.save(newTicket);
    return newTicket;
};

export const getTicketById = async (id: number) => {
    const ticket = await Ticket.findOneBy({ id: id });
    return ticket;
};

export const reserveTicket = async (id: number, userId: number) => {
    const ticket = await Ticket.findOneBy({ id: id });
    const user = await User.findOneBy({ id: userId });
    const event = await Event.findOneBy({ id: ticket?.event?.id });
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    if (ticket.isReserved) {
        throw new Error('Ticket is already reserved');
    }
    if (event.currentAttendeesCount >= event.availableAttendeesCount) {
        throw new Error('Event is full');
    }
    Ticket.update(id, { isReserved: true, reservedAt: new Date(), user: user});
    Event.update(event.id, { currentAttendeesCount: event.currentAttendeesCount + 1 });
};

export const cancelTicketReservation = async (id: number) => {
    const ticket = await Ticket.findOneBy({ id: id });
    const event = await Event.findOneBy({ id: ticket?.event?.id });
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    Ticket.update(id, { isReserved: false, reservedAt: null, user: null});
    Event.update(event.id, { currentAttendeesCount: event.currentAttendeesCount - 1 });
}