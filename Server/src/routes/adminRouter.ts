import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { adminContainer } from "../container/container";
import { AdminController } from "../controllers/adminController";

const router = Router();
router.use(protect, authorize(ROLES.ADMIN));

const adminServices = adminContainer()
const adminController = new AdminController(adminServices)

router.get('/dashboard', adminController.adminDashboard);

// user management
router.patch('/users/:id/status', adminController.changeUserStatus); // Body: { status: 'blocked' } or { isBlocked: true }

// provider management
router.patch('/providers/:id/status', adminController.changeProviderStatus); // blocking
router.patch('/providers/:id/verification', adminController.verifyProvider); // approve \ reject

export default router;