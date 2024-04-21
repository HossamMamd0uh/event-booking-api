import { Event } from '../models/event';
import * as filterHelpers from '../helpers/eventHelpers';
export const getAllEvents = async () => {
    const events = Event.find();
    return events;
};

export const getEventById = async (id: number) => {
    const event = Event.findOneBy({id: id});
    return event;
}

export const createEvent = async (eventData: any) => {
    const newEvent = Event.create(eventData);
    await Event.save(newEvent);
    return newEvent;
};

export const filterEvents = async (query: any) => {
    const filtersQuery = filterHelpers.filterExtractor(query);
    const events = Event.find(filtersQuery);
    return events;
}