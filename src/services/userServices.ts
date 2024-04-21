import { User } from '../models/user';
import * as userHelpers from '../helpers/userHelpers';

export const getAllUsers = async () => {
    const users = User.find();
    return users;
};

export const getUserById = async (id: number) => {
    const user = User.findOneBy({id: id});
    return user;
}

export const createUser = async (userData: any) => {
    userHelpers.validateUserData(userData);
    const hashedPassword = await userHelpers.hashPassword(userData.password);
    userData.password = hashedPassword;
    const newUser = User.create(userData);
    await User.save(newUser);
    return newUser;
};

export const getUsersTickets = async (userId: number) => {
    const tickets = await User.createQueryBuilder('user')
    .leftJoinAndSelect('user.tickets', 'ticket')
    .leftJoinAndSelect('ticket.event', 'event') 
    .where('user.id = :id', {id: userId})
    .select([
        'user.id', 'user.name', 'user.email',
        'ticket.id', 'ticket.number', 'ticket.price', 'ticket.isReserved', 'ticket.reservedAt',
        'event.id', 'event.name', 'event.date'
    ])
    .getMany();
    return tickets;
}

