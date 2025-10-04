import { Router } from 'express';
import { authenticateToken } from './auth.middleware';
import { getUsers, createUser, getManagers } from './users.controller';

const router = Router();
router.use(authenticateToken);

router.get('/', getUsers);
router.post('/', createUser);
router.get('/managers', getManagers);

export default router;