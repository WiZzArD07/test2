// backend/src/routes.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import expenseRoutes from './expense.routes';
import utilsRoutes from './utils.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/expenses', expenseRoutes);
router.use('/utils', utilsRoutes);

export default router;