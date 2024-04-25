import { Ticket } from "../models/ticket";
import { Event } from "../models/event";
import { User } from "../models/user";
import * as ticketServices from "../services/ticketServices";

jest.mock("../models/event", () => ({
    Event: {
      findOneBy: jest.fn(),
      update: jest.fn()
    }
  }));
  
  jest.mock("../models/ticket", () => ({
    Ticket: {
      findOneBy: jest.fn(),
      findBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn()
    }
  }));
  
  jest.mock("../models/user", () => ({
    User: {
      findOneBy: jest.fn()
    }
  }));


describe("Ticket services", () => {
    describe("getTicketsByEventId", () => {
        it("should retrieve tickets for a specific event", async () => {
          const tickets = [{ id: 1, number: "A1" }];
          (Ticket.findBy as jest.Mock).mockResolvedValue(tickets);
          (Event.findOneBy as jest.Mock).mockResolvedValue({ id: 1 });
      
          const result = await ticketServices.getTicketsByEventId(1);
          expect(Event.findOneBy).toHaveBeenCalledWith({ id: 1 });
          expect(Ticket.findBy).toHaveBeenCalledWith({ event: { id: 1 } });
          expect(result).toEqual(tickets);
        });
      });

      describe("createTicket", () => {
        it("should create a new ticket", async () => {
          const ticketData = { number: "A1", price: 100, event: { id: 1 } };
          (Ticket.create as jest.Mock).mockReturnValue({ ...ticketData });
          (Ticket.save as jest.Mock).mockResolvedValue({ id: 1, ...ticketData });
      
          const result = await ticketServices.createTicket(ticketData);
          expect(Ticket.create).toHaveBeenCalledWith(ticketData);
          expect(Ticket.save).toHaveBeenCalled();
          expect(result).toEqual(ticketData);
        });
      });

      describe("getTicketById", () => {
        it("should retrieve a single ticket by ID", async () => {
          const ticket = { id: 1, number: "A1", price: 100 };
          (Ticket.findOneBy as jest.Mock).mockResolvedValue(ticket);
      
          const result = await ticketServices.getTicketById(1);
          expect(Ticket.findOneBy).toHaveBeenCalledWith({ id: 1 });
          expect(result).toEqual(ticket);
        });
      
        it("should return null when no ticket is found", async () => {
            (Ticket.findOneBy as jest.Mock).mockResolvedValue(null);
      
          const result = await ticketServices.getTicketById(999);
          expect(Ticket.findOneBy).toHaveBeenCalledWith({ id: 999 });
          expect(result).toBeNull();
        });
      });

      describe("reserveTicket", () => {
        it("should reserve a ticket and increment event attendees count", async () => {
          const ticket = { id: 1, event: { id: 1, currentAttendeesCount: 0, availableAttendeesCount: 100 }, isReserved: false };
          const user = { id: 1 };
          (Ticket.findOneBy as jest.Mock).mockResolvedValue(ticket);
          (User.findOneBy as jest.Mock).mockResolvedValue(user);
          (Event.findOneBy as jest.Mock).mockResolvedValue(ticket.event);
      
          await ticketServices.reserveTicket(1, 1);
          expect(Ticket.update).toHaveBeenCalledWith(1, expect.anything());
          expect(Event.update).toHaveBeenCalledWith(1, expect.anything());
        });

        it("should throw an error when the ticket is already reserved", async () => {
            const ticket = { id: 1, isReserved: true };
            (Ticket.findOneBy as jest.Mock).mockResolvedValue(ticket);
        
            await expect(ticketServices.reserveTicket(1, 1)).rejects.toThrow("Ticket is already reserved");
          });

        it("should throw an error when the event is full", async () => {
            const ticket = { id: 1, event: { id: 1, currentAttendeesCount: 100, availableAttendeesCount: 100 } };
            (Ticket.findOneBy as jest.Mock).mockResolvedValue(ticket);
            (Event.findOneBy as jest.Mock).mockResolvedValue(ticket.event);
        
            await expect(ticketServices.reserveTicket(1, 1)).rejects.toThrow("Event is full");
          });
      });

      describe("cancelTicketReservation", () => {
        it("should cancel a ticket reservation and decrement event attendees count", async () => {
          const ticket = { id: 1, event: { id: 1, currentAttendeesCount: 10 } };
          (Ticket.findOneBy as jest.Mock).mockResolvedValue(ticket);
          (Event.findOneBy as jest.Mock).mockResolvedValue(ticket.event);
      
          await ticketServices.cancelTicketReservation(1);
          expect(Ticket.update).toHaveBeenCalledWith(1, expect.anything());
          expect(Event.update).toHaveBeenCalledWith(1, expect.anything());
        });

        it("should throw an error when the ticket is not found", async () => {
            (Ticket.findOneBy as jest.Mock).mockResolvedValue(null);
        
            await expect(ticketServices.cancelTicketReservation(1)).rejects.toThrow("Ticket not found");
          });
      });
    });

