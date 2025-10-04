import { Request, Response } from 'express';
import prisma from './prisma';
import multer from 'multer';
import { simulateOcr } from './ocr.service';

const upload = multer({ storage: multer.memoryStorage() });

export const scanReceipt = async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: 'No receipt file uploaded.' });
    try {
        const ocrResult = await simulateOcr(req.file.buffer);
        res.json(ocrResult);
    } catch (error) {
        res.status(500).json({ message: 'Failed to process receipt.' });
    }
};

export const createExpense = async (req: Request, res: Response) => {
    const user = req.user;
    const { amount, currency, category, description, date } = req.body;
    try {
        const expense = await prisma.expense.create({
            data: {
                userId: user.id,
                amount: parseFloat(amount),
                currency, category, description,
                date: new Date(date),
            }
        });
        // In a real app, you would now trigger the workflow logic here
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: 'Error creating expense.' });
    }
};

export const getUserExpenses = async (req: Request, res: Response) => {
    const user = req.user;
    const expenses = await prisma.expense.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' }
    });
    res.json(expenses);
};

export const getPendingApprovals = async (req: Request, res: Response) => {
    const manager = req.user;
    if (manager.role !== 'MANAGER' && manager.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    // This is a simplified logic. A real implementation needs to check complex workflow steps.
    const expenses = await prisma.expense.findMany({
        where: {
            status: 'PENDING',
            user: {
                managerId: manager.id,
                companyId: manager.companyId
            }
        },
        include: { user: { select: { firstName: true, lastName: true }} }
    });
    res.json(expenses);
};

export const updateExpenseStatus = async (req: Request, res: Response) => {
    const manager = req.user;
    const { id } = req.params;
    const { status, comments } = req.body; // status should be 'APPROVED' or 'REJECTED'

    if ((manager.role !== 'MANAGER' && manager.role !== 'ADMIN') || !['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(403).json({ message: 'Forbidden or invalid status' });
    }
    
    try {
        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: { status }
        });
        // Here you would log the approval action in the ExpenseApproval table
        res.json(updatedExpense);
    } catch(error) {
        res.status(404).json({ message: 'Expense not found.' });
    }
};