import bcrypt from 'bcrypt';

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

export const validateUserData = (userData: any) => {
    if (!validateEmail(userData.email)) {
        throw new Error('Invalid email');
    }
    if (!validatePassword(userData.password)) {
        throw new Error('Invalid password');
    }
};

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10);
};