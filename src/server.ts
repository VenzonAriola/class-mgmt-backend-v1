import { config } from 'dotenv';
import { connectDB } from './lib/prisma';
import express from 'express';
import subjectsRouter from './routes/subjects';
import cors from 'cors';

const app = express();
const PORT = 5001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/subjects', subjectsRouter);

config()
connectDB()


app.get('/', (req, res) => {
  res.send('Welcome to the Class Management System API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});