import express from "express";
import authorize from '../middleware/authorize'
import { joinEnrollment, postEnrollments } from "../controllers/enrollmentsControllers"

const router = express.Router();


router.post('/', authorize('admin', 'student'), postEnrollments );

router.post('/join', authorize('admin', 'student'), joinEnrollment)

export default router;
