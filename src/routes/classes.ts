import express from 'express';
import authorize from '../middleware/authorize';
import { getClassDetails, getAllClasses, postClasses } from '../controllers/classesControllers';

const router = express.Router();

// POST Classes
router.post('/', authorize('admin', 'teacher'),postClasses);

router.get('/', getAllClasses);

// REST-style detail route for Refine and API clients
router.get('/:id', getClassDetails);

// Legacy route support
router.get('/show/:id', getClassDetails);

export default router;
