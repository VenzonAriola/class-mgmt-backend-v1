import AgentApi from 'apminsight';
AgentApi.config();
import { config } from 'dotenv';
import { connectDB } from './db/prisma';
import express from 'express';
import subjectsRouter from './routes/subjects';
import usersRouter from './routes/user';
import classesRouter from './routes/classes';
import departmentsRouter from './routes/department';
import enrollmentsRouter from './routes/enrollments';
import statsRouter from './routes/stats';
import cors from 'cors';
import securityMiddleware from './middleware/security';
import authSessionMiddleware from './middleware/authSession';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
config();
const app = express();
const PORT = 5001;
const allowedOrigins = [
    process.env.FRONTEND_URL?.replace(/\/$/, '') || 'http://localhost:5173',
    'https://class-mgmt-frontend-v1.vercel.app',
];
const corsOptions = {
    origin: 'https://class-mgmt-frontend-v1.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.all('/api/auth/*splat', toNodeHandler(auth));
//body parser
app.use(express.json());
app.use(authSessionMiddleware);
app.use(securityMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/stats', statsRouter);
// Allow legacy/root frontend paths in case the frontend is not using the /api prefix
app.use('/subjects', subjectsRouter);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/departments', departmentsRouter);
app.use('/enrollments', enrollmentsRouter);
app.use('/stats', statsRouter);
connectDB();
app.get('/', (req, res) => {
    res.send('Welcome to the Class Management System API!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map