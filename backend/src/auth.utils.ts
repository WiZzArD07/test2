import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};

export const generateToken = (user: { id: string; email: string; role: string; companyId: string }) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};