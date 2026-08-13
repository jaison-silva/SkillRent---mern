import express from "express";
import { authorize } from "../middlewares/roleAuthoriseMiddleware";
import { protect } from "../middlewares/authMiddleware";
import { ROLES } from "../constants/rolesConstants";
import { chatContainer } from "../container/container";

const router = express.Router();
router.use(protect);
const chatController = chatContainer();

// Both users and providers can access chat
router.get("/conversations", authorize(ROLES.USER, ROLES.PROVIDER), chatController.getConversations);
router.get("/messages/:conversationId", authorize(ROLES.USER, ROLES.PROVIDER), chatController.getMessages);
router.post("/conversations", authorize(ROLES.USER, ROLES.PROVIDER), chatController.getOrCreateConversation);

// Negotiation routes
router.put("/:conversationId/propose", authorize(ROLES.USER, ROLES.PROVIDER), chatController.proposeTerms);
router.put("/:conversationId/confirm", authorize(ROLES.USER, ROLES.PROVIDER), chatController.toggleConfirmation);

export default router;
