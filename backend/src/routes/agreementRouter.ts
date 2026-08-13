import express from "express";
import { agreementController } from "../controllers/agreementController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, agreementController.getAgreements);

export default router;
