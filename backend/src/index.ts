import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app = express();
app.use(cors());
app.use(express.json());

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
