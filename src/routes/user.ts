import express from "express";
import { getAllUsers, getUserDepartments, getUserDetails, getUserSubjects } from "../controllers/usersController";

const router = express.Router();

// Get All Users
router.get("/", getAllUsers);

router.get("/:id",getUserDetails);

router.get("/:id/departments", getUserDepartments);

router.get("/:id/subjects", getUserSubjects);

export default router;
