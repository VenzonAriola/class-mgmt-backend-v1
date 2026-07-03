import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentClasses,
  getDepartmentDetails,
  getDepartmentSubjects,
  getDepartmentUsers,
} from "../controllers/departmentControllers";

const router = express.Router();

// POST Create Department
router.post("/", createDepartment);

// GET All Departments
router.get("/", getAllDepartments);

router.get("/:id/subjects", getDepartmentSubjects);
router.get("/:id/classes", getDepartmentClasses);
router.get("/:id/users", getDepartmentUsers);
router.get("/:id", getDepartmentDetails);

router.get("/show/:id", getDepartmentDetails);

export default router;
