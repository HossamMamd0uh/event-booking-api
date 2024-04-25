import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const login = async (email: string, password: string) => {
    const user = await User.findOneBy({ email: email });
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error('Incorrect password');
    }
    const token = jwt.sign({ id: user.id }, config.jwtSecret);
    return {token, user};
}