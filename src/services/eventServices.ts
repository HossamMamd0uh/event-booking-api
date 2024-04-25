import { Event } from "../models/event";
import { Category } from "../models/category";
import { validate } from 'class-validator';
import { CreateEventDTO } from '../dto/createEvent.dto';
interface EventDTO {
  id: number;
  name: string;
  date: Date;
  description: string;
  category: string;
  availableAttendeesCount: number;
  currentAttendeesCount: number;
}


// Helper function to format event data
function formatEventData(data: any): EventDTO {
  return {
    id: data.event_id,
    name: data.event_name,
    date: data.event_date,
    description: data.event_description,
    category: data.category_name,
    availableAttendeesCount: data.event_availableAttendeesCount,
    currentAttendeesCount: data.event_currentAttendeesCount,
  };
}

export const getAllEvents = async (): Promise<EventDTO[]> => {
  const events = await Event.createQueryBuilder("event")
    .leftJoin("event.categoryId", "category")
    .select([
      "event.id",
      "event.name",
      "event.date",
      "event.availableAttendeesCount",
      "event.description",
      "event.currentAttendeesCount",
      "category.name",
    ])
    .getRawMany();

  return events.map(formatEventData);
};

export const getEventById = async (id: number): Promise<EventDTO | null> => {
  const event = await Event.createQueryBuilder("event")
    .leftJoin("event.categoryId", "category")
    .select([
      "event.id",
      "event.name",
      "event.date",
      "event.description",
      "event.availableAttendeesCount",
      "event.currentAttendeesCount",
      "category.name",
    ])
    .where("event.id = :id", { id: id })
    .getRawOne();

  return event ? formatEventData(event) : null;
};

export const createEvent = async (eventData: CreateEventDTO): Promise<Event> => {
    
    // Validate event data
    const errors = await validate(eventData);
    if (errors.length > 0) {
        throw new Error(errors.map(e => Object.values(e.constraints).join(', ')).join('; '));
    }

    // Validate the category existence
    const category = await Category.findOneBy({ id: eventData.category });
    if (!category) {
        throw new Error('Category not found');
    }

    const event = new Event();
    event.name = eventData.name;
    event.description = eventData.description;
    event.availableAttendeesCount = eventData.availableAttendeesCount;
    event.date = eventData.date;
    event.categoryId = category; 
    await event.save();
    return event;
};

export const filterEvents = async (query: any): Promise<EventDTO[]> => {
  const events = await Event.createQueryBuilder("event")
    .where(query)
    .leftJoin("event.categoryId", "category")
    .select([
      "event.id",
      "event.name",
      "event.date",
      "event.description",
      "event.availableAttendeesCount",
      "event.currentAttendeesCount",
      "category.name",
    ])
    .getRawMany();

  return events.map(formatEventData);
};
