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

