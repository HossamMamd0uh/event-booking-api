import { Ticket } from '../models/ticket';
import { Event } from '../models/event';
import { User } from '../models/user';
import cron from 'node-cron';
import moment from 'moment';
import { sendMail } from '../mailers/notificationMailer';
import { config } from '../config/config';

interface EventNotificationDTO {
    userEmail: string;
    eventDate: Date;
    eventName: string;
}

const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: config.timeZone || 'Europe/Sofia'
    });
};

const sendWeeklyNotification = async (events: EventNotificationDTO[], message: string) => {
    const eventsByUser = events.reduce((acc, event) => {
        (acc[event.userEmail] = acc[event.userEmail] || []).push(event);
        return acc;
    }, {});

    for (const [userEmail, userEvents] of Object.entries(eventsByUser)) {
        const eventList = (userEvents as EventNotificationDTO[]).map(event =>
            `Event: ${event.eventName} on ${formatDate(new Date(event.eventDate))}`
        ).join('\n');
        const emailBody = `${message}\n\n${eventList}`;
        await sendMail(userEmail, 'Weekly Event Update', emailBody);
    }
};

const sendReminderNotification = async (events: EventNotificationDTO[], message: string) => {
    for (const event of events) {
        const formattedDate = formatDate(new Date(event.eventDate));
        const emailBody = `${message} Event: ${event.eventName} on ${formattedDate}`;
        await sendMail(event.userEmail, 'Event Reminder', emailBody);
    }
};

const getReservedTickets = async (): Promise<EventNotificationDTO[]> => {
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    return await Ticket.createQueryBuilder('ticket')
        .innerJoinAndSelect('ticket.event', 'event')
        .innerJoinAndSelect('ticket.user', 'user')
        .select('user.email', 'email')
        .addSelect('event.date', 'eventDate')
        .addSelect('event.name', 'eventName')
        .where('ticket.isReserved = :isReserved', { isReserved: true })
        .andWhere('event.date BETWEEN :todayStart AND :todayEnd', { todayStart, todayEnd })
        .distinct(true)
        .getRawMany()
        .then(tickets => tickets.map(ticket => ({
            userEmail: ticket.email,
            eventDate: ticket.eventDate,
            eventName: ticket.eventName
        })));
};

const getUpcomingEvents = async (): Promise<EventNotificationDTO[]> => {
    const todayStart = moment().startOf('day').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const upcomingEvents = await Event.createQueryBuilder('event')
        .select('event.name', 'eventName')
        .addSelect('event.date', 'eventDate')
        .where('event.date > :todayStart AND event.date <= :endOfWeek', { todayStart, endOfWeek })
        .getRawMany();

    const systemUsers = await User.createQueryBuilder('user')
        .select('user.email', 'email')
        .getRawMany();

    return systemUsers.flatMap(user => upcomingEvents.map(event => ({
        userEmail: user.email,
        eventDate: event.eventDate,
        eventName: event.eventName
    })));
};

export const scheduleNotifications = async () => {
    // Run every day at 8:00 AM
    cron.schedule('0 0 8 * * *', async () => {
        const eventsToday = await getReservedTickets();
        await sendReminderNotification(eventsToday, 'Reminder: You have an upcoming event today!');
    });

    // Run every Monday at 8:00 AM
    cron.schedule('0 0 8 * * 1', async () => {
        const eventsThisWeek = await getUpcomingEvents();
        await sendWeeklyNotification(eventsThisWeek, 'Here are the upcoming events this week:');
    });
};
