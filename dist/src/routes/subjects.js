import express from "express";
import { createSubject, getAllSubjects, getSubjectDetails } from "../controllers/subjectsContoller";
const router = express.Router();
// Create Subject
router.post("/", createSubject);
//Get All Subjects
router.get("/", getAllSubjects);
router.get("/:id", getSubjectDetails);
export default router;
//# sourceMappingURL=subjects.js.map