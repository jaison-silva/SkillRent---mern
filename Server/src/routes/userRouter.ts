import { Router } from "express";
import { HeaderAuth } from "../middlewares/authMiddleware";
import isUser from "../middlewares/isUserMiddleware";
import { userHomeController, userProfileController, updateUserProfileController,userDetailedController,listUsersController } from "../controllers/userController";

const router = Router()
 
router.get('/home', HeaderAuth, isUser, userHomeController)
router.get('/profile', HeaderAuth, isUser, userProfileController)
router.patch('/updateProfile', HeaderAuth, isUser, updateUserProfileController)
router.get('/userDetailed/:id', HeaderAuth, userDetailedController)
router.get('/listUsers', HeaderAuth, listUsersController)

export default router 