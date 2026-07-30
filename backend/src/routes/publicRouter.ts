import { Router } from "express";
import { revenueContainer } from "../container/container";
import { RevenueController } from "../controllers/revenueController";

const router = Router();
const revenueController = new RevenueController(revenueContainer());

// Public routes for fetching active promotions
router.get('/memberships', revenueController.getMemberships);
router.get('/offers', revenueController.getOffers);
router.get('/coupons', revenueController.getCoupons);

export default router;
