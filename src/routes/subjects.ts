import express from "express";
import authorize from '../middleware/authorize'
import { createSubject, getAllSubjects, getSubjectDetails } from "../controllers/subjectsContoller";

const router = express.Router();

// Create Subject
router.post("/", authorize("admin", "teacher"),createSubject)

//Get All Subjects
router.get("/", getAllSubjects)

router.get("/:id", getSubjectDetails)




export default router;

