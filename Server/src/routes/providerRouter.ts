import { Router } from "express";
import { HeaderAuth } from "../middlewares/authMiddleware";
import isProvider from "../middlewares/isProviderMiddleware";
import { providerProfileController, updateProviderProfileController, listProvidersController,ProviderDetailsController } from "../controllers/providerController";

const router = Router();

// router.patch('/dashboard', HeaderAuth, isProvider, providerDashboard);
router.get('/profile', HeaderAuth, isProvider, providerProfileController);
router.patch('/updateProfile', HeaderAuth, isProvider, updateProviderProfileController);
router.get('/listProviders', HeaderAuth, listProvidersController)
router.get('/providerDetailed/:id', HeaderAuth,ProviderDetailsController)

export default router;   