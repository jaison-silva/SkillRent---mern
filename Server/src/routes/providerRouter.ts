import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { ProviderContainer } from "../container/container";
import { ProviderController } from "../controllers/providerController";

const router = Router();

router.use(protect);

const providerService = ProviderContainer()
const providerController = new ProviderController(providerService)

// self
router.get('/profile', authorize(ROLES.PROVIDER), providerController.getProfile);
router.patch('/profile', authorize(ROLES.PROVIDER), providerController.updateProfile);


router.get('/', authorize(ROLES.USER, ROLES.ADMIN, ROLES.PROVIDER), providerController.listProviders);
router.get('/:id', authorize(ROLES.USER, ROLES.ADMIN, ROLES.PROVIDER), providerController.getProviderById);

export default router;