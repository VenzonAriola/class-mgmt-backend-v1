import express from "express";
import { joinEnrollment, postEnrollments } from "../controllers/enrollmentsControllers";
const router = express.Router();
router.post('/', postEnrollments);
router.post('/join', joinEnrollment);
export default router;
//# sourceMappingURL=enrollments.js.map