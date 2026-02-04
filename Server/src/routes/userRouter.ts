import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { userContainer } from "../container/container";
import { UserController } from "../controllers/userController";

const router = Router();

const userService = userContainer()
const userController = new UserController(userService)

// Public routes (any authenticated user can access)
router.get('/', protect, userController.listUsers);
router.get('/:id', protect, userController.getUser);

// User-only routes
router.get('/dashboard', protect, authorize(ROLES.USER), userController.getDashboard);
router.get('/profile', protect, authorize(ROLES.USER), userController.getProfile);
router.patch('/profile', protect, authorize(ROLES.USER), userController.updateProfile);

export default router;