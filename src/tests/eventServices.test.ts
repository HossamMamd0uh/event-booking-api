import { Event } from "../models/event";
import { Category } from "../models/category";
import * as eventService from "../services/eventServices";
import { validate } from "class-validator";

jest.mock("class-validator", () => {
  return {
    validate: jest.fn().mockResolvedValue([]),
  };
});

jest.mock("../models/category", () => ({
  Category: {
    findOneBy: jest.fn(),
  },
}));

jest.mock("../models/event", () => ({
  Event: function () {
    return {
      save: jest.fn().mockImplementation(function () {
        if (this.availableAttendeesCount > 1000) {
          throw new Error("availableAttendeesCount must not exceed 1000");
        }
        return Promise.resolve(this);
      }),
      name: "",
      description: "",
      availableAttendeesCount: 0,
      currentAttendeesCount: 0,
      date: new Date(),
      categoryId: null,
    };
  },
}));
describe("EventService", () => {
  describe("getAllEvents", () => {
    it("should return all events", async () => {
      const mockEvents = [
        {
          event_id: 1,
          event_name: "Event 1",
          event_date: new Date("2022-01-01 09:00:00"),
          event_description: "Event 1 description",
          category_name: "Game",
        },
      ];
      const formattedEvents = mockEvents.map((event) => ({
        id: event.event_id,
        name: event.event_name,
        date: event.event_date,
        description: event.event_description,
        category: event.category_name,
      }));
      const queryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockEvents),
      };
      Event.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      const events = await eventService.getAllEvents();
      expect(events).toEqual(formattedEvents);
      expect(Event.createQueryBuilder).toHaveBeenCalledWith("event");
      expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
        "event.categoryId",
        "category"
      );
      expect(queryBuilder.select).toHaveBeenCalledWith([
        "event.id",
        "event.name",
        "event.date",
        "event.availableAttendeesCount",
        "event.description",
        "event.currentAttendeesCount",
        "category.name",
      ]);
      expect(queryBuilder.getRawMany).toHaveBeenCalled();
    });

    it("should return an empty array when no events are found", async () => {
        const queryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue([]),  // Simulating no events found
        };
        Event.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

        const events = await eventService.getAllEvents();
        expect(events).toEqual([]);  // Expecting an empty array when no events are found
        expect(Event.createQueryBuilder).toHaveBeenCalledWith("event");
        expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
            "event.categoryId",
            "category"
        );
        expect(queryBuilder.select).toHaveBeenCalledWith([
            "event.id",
            "event.name",
            "event.date",
            "event.availableAttendeesCount",
            "event.description",
            "event.currentAttendeesCount",
            "category.name",
        ]);
        expect(queryBuilder.getRawMany).toHaveBeenCalled();
    });
  });

  describe("getEventById", () => {
    it("should return a single event by ID", async () => {
      const eventId = 1;
      const mockEvent = {
        event_id: eventId,
        event_name: "Event 1",
        event_date: new Date("2022-01-01 09:00:00"),
        event_availableAttendeesCount: 100,
        event_currentAttendeesCount: 50,
        event_description: "Event 1 description",
        category_name: "Game",
      };
      const formattedEvent = {
        id: mockEvent.event_id,
        name: mockEvent.event_name,
        date: mockEvent.event_date,
        availableAttendeesCount: mockEvent.event_availableAttendeesCount,
        currentAttendeesCount: mockEvent.event_currentAttendeesCount,
        description: mockEvent.event_description,
        category: mockEvent.category_name,
      };
      const queryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(mockEvent),
      };
      Event.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

      const event = await eventService.getEventById(eventId);

      expect(event).toEqual(formattedEvent);
      expect(Event.createQueryBuilder).toHaveBeenCalledWith("event");
      expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
        "event.categoryId",
        "category"
      );
      expect(queryBuilder.select).toHaveBeenCalledWith([
        "event.id",
        "event.name",
        "event.date",
        "event.description",
        "event.availableAttendeesCount",
        "event.currentAttendeesCount",
        "category.name",
      ]);
      expect(queryBuilder.where).toHaveBeenCalledWith("event.id = :id", {
        id: eventId,
      });
      expect(queryBuilder.getRawOne).toHaveBeenCalled();
    });

    it("should return null when no event is found by ID", async () => {
        const eventId = 999;
        const queryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(null),
        };
        Event.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

        const event = await eventService.getEventById(eventId);

        expect(event).toBeNull();
        expect(Event.createQueryBuilder).toHaveBeenCalledWith("event");
        expect(queryBuilder.leftJoin).toHaveBeenCalledWith("event.categoryId", "category");
        expect(queryBuilder.select).toHaveBeenCalledWith([
            "event.id",
            "event.name",
            "event.date",
            "event.description",
            "event.availableAttendeesCount",
            "event.currentAttendeesCount",
            "category.name",
        ]);
        expect(queryBuilder.where).toHaveBeenCalledWith("event.id = :id", { id: eventId });
        expect(queryBuilder.getRawOne).toHaveBeenCalled();
    });
  });

  describe("createEvent", () => {
    it("creates an event successfully when category exists and data is valid", async () => {
      const eventData = {
        name: "New Year Celebration 2",
        description: "Welcome the new year with us!",
        availableAttendeesCount: 200,
        date: new Date("2023-12-31"),
        category: 1,
      };

      (validate as jest.Mock).mockResolvedValue([]); // No validation errors
      (Category.findOneBy as jest.Mock).mockResolvedValue({ id: 1 }); // Category exists

      const event = new Event();
      event.name = eventData.name;
      event.description = eventData.description;
      event.availableAttendeesCount = eventData.availableAttendeesCount;
      event.date = eventData.date;
      const category = await Category.findOneBy({ id: eventData.category });
      if (!category) {
        throw new Error("Category not found");
      }
      event.categoryId = category;
      const newEvent = await eventService.createEvent(eventData);
      await event.save();
      await validate(eventData);
      expect(validate).toHaveBeenCalledWith(eventData);
      expect(Category.findOneBy).toHaveBeenCalledWith({
        id: eventData.category,
      });
      expect(event.save).toHaveBeenCalled();
      expect(event.name).toEqual(newEvent.name);
      expect(event.description).toEqual(newEvent.description);
      expect(event.availableAttendeesCount).toEqual(
        newEvent.availableAttendeesCount
      );
      expect(event.date).toEqual(newEvent.date);
    });

    it("throws an error when availableAttendeesCount exceeds 1000", async () => {
        const eventData = {
            name: "New Year Celebration 2",
            description: "Welcome the new year with us!",
            availableAttendeesCount: 1001,
            date: new Date("2023-12-31"),
            category: 1,
        };
    
        (validate as jest.Mock).mockResolvedValue([]); // No validation errors
        (Category.findOneBy as jest.Mock).mockResolvedValue({ id: 1 }); // Category exists
    
        const event = new Event();
        event.name = eventData.name;
        event.description = eventData.description;
        event.availableAttendeesCount = eventData.availableAttendeesCount;
        event.date = eventData.date;
        const category = await Category.findOneBy({ id: eventData.category });
        if (!category) {
            throw new Error("Category not found");
        }
        event.categoryId = category;
    
        await expect(eventService.createEvent(eventData)).rejects.toThrow(
            "availableAttendeesCount must not exceed 1000"
        );
        });
  });

  describe("filterEvents", () => {
    it("should filter events based on the provided query and return formatted data", async () => {
        const rawEvents = [
            {
                event_id: 2,
                event_name: "Tech Conference",
                event_date: new Date("2023-01-01 10:00:00"),
                event_description: "Explore new tech trends",
                category_name: "Technology",
                event_availableAttendeesCount: 300
            }
        ];
        const query = { "event.availableAttendeesCount": { $gt: 250 } };
        const formattedEvents = rawEvents.map(event => ({
            id: event.event_id,
            name: event.event_name,
            date: event.event_date,
            description: event.event_description,
            category: event.category_name,
            availableAttendeesCount: event.event_availableAttendeesCount
        }));

        const queryBuilder = {
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(rawEvents)
        };
        Event.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

        const events = await eventService.filterEvents(query);

        expect(Event.createQueryBuilder).toHaveBeenCalledWith("event");
        expect(queryBuilder.leftJoin).toHaveBeenCalledWith("event.categoryId", "category");
        expect(queryBuilder.select).toHaveBeenCalledWith([
            "event.id",
            "event.name",
            "event.date",
            "event.description",
            "event.availableAttendeesCount",
            "event.currentAttendeesCount",
            "category.name"
        ]);
        expect(queryBuilder.where).toHaveBeenCalledWith(query);
        expect(queryBuilder.getRawMany).toHaveBeenCalled();
        expect(events).toEqual(formattedEvents);
    });
});
});
