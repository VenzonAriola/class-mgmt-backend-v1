import { config } from 'dotenv';
import { connectDB } from './lib/prisma';
import express from 'express';
import subjectsRouter from './routes/subjects';
import cors from 'cors';
config();
const app = express();
const PORT = 5001;
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/subjects', subjectsRouter);
connectDB();
app.get('/', (req, res) => {
    res.send('Welcome to the Class Management System API!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map