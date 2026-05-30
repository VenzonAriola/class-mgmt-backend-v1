import express from 'express';
import { postClasses } from '../controllers/classesControllers';

const router = express.Router();

// POST Classes
router.post('/', postClasses);

export default router;
