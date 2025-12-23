import { Router } from "express";
import isProvider from "../middlewares/isProvider";
import { authenticate } from "../middlewares/authMiddleware";
import { providerProfile, updateProviderProfile, providerDashboard } from "../controllers/providerController";

const router = Router();

router.get('/profile', authenticate, isProvider, providerProfile);
router.patch('/profile', authenticate, isProvider, updateProviderProfile);
router.patch('/dashboard', authenticate, isProvider, providerDashboard);

export default router;