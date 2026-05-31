import express from 'express';
import { getAllClasses, postClasses } from '../controllers/classesControllers';

const router = express.Router();

// POST Classes
router.post('/', postClasses);

router.get('/', getAllClasses);

export default router;
