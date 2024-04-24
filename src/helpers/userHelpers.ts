import bcrypt from 'bcrypt';

const validateEmail = (email: string) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(String(email).toLowerCase());
};

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return passwordRegex.test(password);
};

export const validateUserData = (userData: any) => {
    if (!validateEmail(userData.email)) {
        return 'Invalid email';
    }
    if (!validatePassword(userData.password)) {
        return 'Invalid password';
    }
    return null;
};

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10);
};