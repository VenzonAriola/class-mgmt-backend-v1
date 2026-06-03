import express from 'express';
import { getClassDetails, getAllClasses, postClasses } from '../controllers/classesControllers';

const router = express.Router();

// POST Classes
router.post('/', postClasses);

router.get('/', getAllClasses);

// REST-style detail route for Refine and API clients
router.get('/:id', getClassDetails);

// Legacy route support
router.get('/show/:id', getClassDetails);

export default router;
