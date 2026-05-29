import express from "express";
import { getAllSubjects } from "../controllers/subjectsContoller";
const router = express.Router();
//Get All Subjects
router.get("/", getAllSubjects);
export default router;
//# sourceMappingURL=subjects.js.map