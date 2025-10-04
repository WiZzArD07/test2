import { Request, Response } from 'express';
import prisma from './prisma';
import { hashPassword, comparePassword, generateToken } from './auth.utils';

export const register = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, companyName, currency } = req.body;
    try {
        const passwordHash = await hashPassword(password);

        const newCompany = await prisma.company.create({
            data: {
                name: companyName,
                currency: currency,
                users: {
                    create: {
                        firstName,
                        lastName,
                        email,
                        passwordHash,
                        role: 'ADMIN',
                    },
                },
            },
            include: { users: true },
        });

        res.status(201).json(newCompany.users[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error creating user or company. Email may already exist.' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await comparePassword(password, user.passwordHash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
