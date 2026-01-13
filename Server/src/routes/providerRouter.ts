import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { 
    getProviderProfile, 
    updateProviderProfile, 
    getAllProviders, 
    getProviderById 
} from "../controllers/providerController";

const router = Router();

router.use(protect);

// --- Me (The Current Provider) ---
router.get('/profile', authorize(ROLES.PROVIDER), getProviderProfile);
router.patch('/profile', authorize(ROLES.PROVIDER), updateProviderProfile);

// --- General Provider Resources ---
router.get('/', getAllProviders);       // /providers (List all)
router.get('/:id', getProviderById);    // /providers/123 (Details)

export default router;