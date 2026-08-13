import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { adminContainer, revenueContainer } from "../container/container";
import { AdminController } from "../controllers/adminController";
import { RevenueController } from "../controllers/revenueController";

const router = Router();
router.use(protect, authorize(ROLES.ADMIN));

const adminServices = adminContainer()
const adminController = new AdminController(adminServices)
const revenueController = new RevenueController(revenueContainer());

router.get('/dashboard', adminController.adminDashboard);

// user management
router.patch('/users/:id/status', adminController.changeUserStatus); // Body: { status: 'blocked' } or { isBlocked: true }

// provider management
router.patch('/providers/:id/status', adminController.changeProviderStatus); // blocking
router.patch('/providers/:id/verification', adminController.verifyProvider); // approve \ reject

// Memberships
router.post('/memberships', revenueController.createMembership);
router.get('/memberships', revenueController.getMemberships);
router.put('/memberships/:id', revenueController.updateMembership);
router.delete('/memberships/:id', revenueController.deleteMembership);

// Coupons
router.post('/coupons', revenueController.createCoupon);
router.get('/coupons', revenueController.getCoupons);
router.put('/coupons/:id', revenueController.updateCoupon);
router.delete('/coupons/:id', revenueController.deleteCoupon);

// Offers
router.post('/offers', revenueController.createOffer);
router.get('/offers', revenueController.getOffers);
router.put('/offers/:id', revenueController.updateOffer);
router.delete('/offers/:id', revenueController.deleteOffer);

import categoryController from "../controllers/categoryController";
// Categories
router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.delete('/categories/:id', categoryController.deleteCategory);

export default router;