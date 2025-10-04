import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// This is a placeholder for auth middleware. In a real app, you'd verify the JWT.
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // req.user = { userId: 'some-user-id-from-token' }; // Decode JWT and attach user
    next();
};


// POST /api/expenses
router.post('/', authMiddleware, async (req, res) => {
  // const { userId } = req.user; // Get user from token
  const { userId, amount, currency, category, description, date } = req.body; // Using body for hackathon simplicity

  try {
    const expense = await prisma.expense.create({
      data: {
        userId,
        amount: parseFloat(amount),
        currency,
        category,
        description,
        date: new Date(date),
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create expense.' });
  }
});

// GET /api/expenses/user/:userId
router.get('/user/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;
    try {
        const expenses = await prisma.expense.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
});


export default router;