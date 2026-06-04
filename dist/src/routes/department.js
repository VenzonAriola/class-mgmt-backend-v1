import express from "express";
import { getAllDepartments } from "../controllers/departmentControllers";
const router = express.Router();
// GET All Departments
router.get("/", getAllDepartments);
export default router;
//# sourceMappingURL=department.js.map