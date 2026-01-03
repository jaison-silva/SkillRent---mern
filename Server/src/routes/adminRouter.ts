import { Router } from "express";
import isAdmin from "../middlewares/isAdmin";
import { authenticate } from "../middlewares/authMiddleware";
import { adminDashboard } from "../controllers/adminController";

const router = Router()

router.get('/dashboard',authenticate,isAdmin,adminDashboard)
router.patch('/user/:id/block',authenticate,isAdmin,)
router.patch('/provider/:id/verification',authenticate,isAdmin,)
router.patch('/provider/:id/block',authenticate,isAdmin,)

export default router