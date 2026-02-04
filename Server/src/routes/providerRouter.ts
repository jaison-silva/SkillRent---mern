import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { ProviderContainer } from "../container/container";
import { ProviderController } from "../controllers/providerController";

const router = Router();

const providerService = ProviderContainer()
const providerController = new ProviderController(providerService)

// Public routes (any authenticated user can access)
router.get('/', protect, providerController.listProviders);
router.get('/:id', protect, providerController.getProviderById);

// Provider-only routes
router.get('/profile', protect, authorize(ROLES.PROVIDER), providerController.getProfile);
router.patch('/profile', protect, authorize(ROLES.PROVIDER), providerController.updateProfile);

export default router;