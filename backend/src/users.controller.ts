import { Request, Response } from 'express';
import prisma from './prisma';
import { hashPassword } from './auth.utils';

export const getUsers = async (req: Request, res: Response) => {
    const admin = req.user;
    if (admin.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
    
    const users = await prisma.user.findMany({ 
        where: { companyId: admin.companyId },
        select: { id: true, firstName: true, lastName: true, email: true, role: true, managerId: true }
    });
    res.json(users);
};

export const getManagers = async (req: Request, res: Response) => {
    const user = req.user;
    const managers = await prisma.user.findMany({
        where: { companyId: user.companyId, role: 'MANAGER' },
        select: { id: true, firstName: true, lastName: true }
    });
    res.json(managers);
};

export const createUser = async (req: Request, res: Response) => {
    const admin = req.user;
    const { firstName, lastName, email, password, role, managerId } = req.body;
    if (admin.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    try {
        const passwordHash = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                firstName, lastName, email, passwordHash, role, managerId,
                companyId: admin.companyId,
            },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user. Email may already exist.' });
    }
};
