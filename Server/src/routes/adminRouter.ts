import { Router } from "express";
import isAdmin from "../middlewares/isAdminMiddleware";
import { HeaderAuth } from "../middlewares/authMiddleware";
import { adminDashboard, blockUser,blockProvider,verifyProvider} from "../controllers/adminController";

const router = Router()
 
router.get('/dashboard',HeaderAuth,isAdmin,adminDashboard)
router.patch('/provider/:id/block',HeaderAuth,isAdmin,blockProvider)
router.patch('/user/:id/block',HeaderAuth,isAdmin,blockUser)
router.patch('/provider/:id/verification',HeaderAuth,isAdmin,verifyProvider)

export default router