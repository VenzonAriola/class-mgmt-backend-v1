import express from "express";
import { getAllUsers } from "../controllers/usersController";
const router = express.Router();
// Get All Users
router.get("/", getAllUsers);
export default router;
//# sourceMappingURL=user.js.map