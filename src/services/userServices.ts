import { User } from '../models/user';
import * as userHelpers from '../helpers/userHelpers';

interface UserDTO {
    id: number;
    name: string;
    email: string;
}

function formatUser(user: User): UserDTO {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}

export const getAllUsers = async (): Promise<UserDTO[]> => {
    const users: UserDTO[] = await User.find();
    return users.map(formatUser);
};

export const getUserById = async (id: number): Promise<UserDTO | null> => {
    const user = await User.findOneBy({id: id});
    return user ? formatUser(user) : null;
}

export const createUser = async (userData: any) => {
    try{
        const userValidations = userHelpers.validateUserData(userData);
        if (userValidations !== null) {
            throw new Error(userValidations);
        }
        else{
        const hashedPassword = await userHelpers.hashPassword(userData.password);
        userData.password = hashedPassword;
        const newUser = User.create(userData);
        await User.save(newUser);
        return newUser;}
    }
    catch(err) {
        throw new Error(err);
    }

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

