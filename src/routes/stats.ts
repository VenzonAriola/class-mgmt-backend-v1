import express from "express";
import {getOverview, getLatest, getChartDetails} from "../controllers/statsControllers"

const router = express.Router();


router.get('/overview', getOverview)
router.get('/latest', getLatest)
router.get('/charts', getChartDetails)


export default router;