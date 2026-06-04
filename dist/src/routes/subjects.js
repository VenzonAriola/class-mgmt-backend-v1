import express from "express";
import { getAllSubjects, getSubjectDetails } from "../controllers/subjectsContoller";
const router = express.Router();
//Get All Subjects
router.get("/", getAllSubjects);
router.get("/:id", getSubjectDetails);
export default router;
//# sourceMappingURL=subjects.js.map