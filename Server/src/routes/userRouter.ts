import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import isUser from "../middlewares/isUser";
// import { updateUserProfile, userProfile, listProviders } from "../controllers/userController";
import { updateUserProfile, userProfile } from "../controllers/userController";


const router = Router()

router.get('/profile',authenticate,isUser,userProfile)
router.patch('/profile',authenticate,isUser,updateUserProfile)
// router.get('/providers',authenticate,isUser,listProviders)
router.get('/providers/:id',authenticate,isUser,)


export default router