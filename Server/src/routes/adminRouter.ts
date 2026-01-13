import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { 
    getDashboardStats, 
    changeUserStatus, 
    changeProviderStatus, 
    verifyProvider 
} from "../controllers/adminController";

const router = Router();

router.use(protect, authorize(ROLES.PROVIDER));

router.get('/dashboard', getDashboardStats);

// --- User Management ---
// We use /users here to indicate we are acting on users, but under the admin namespace
router.patch('/users/:id/status', changeUserStatus); // Body: { status: 'blocked' } or { isBlocked: true }

// --- Provider Management ---
router.patch('/providers/:id/status', changeProviderStatus);
router.patch('/providers/:id/verification', verifyProvider);

export default router;