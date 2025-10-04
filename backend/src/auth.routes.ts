import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { companyName, currency, firstName, lastName, email, password } = req.body;

  if (!companyName || !firstName || !email || !password || !currency) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newCompany = await prisma.company.create({
      data: {
        name: companyName,
        currency: currency,
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: 'ADMIN',
        companyId: newCompany.id,
      },
    });

    res.status(201).json({ message: 'Company and Admin user created!', userId: adminUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user.id, role: user.role, companyId: user.companyId };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.firstName, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;