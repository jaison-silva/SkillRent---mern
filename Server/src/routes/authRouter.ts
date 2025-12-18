import { Router } from "express";
const router = Router()

import { registerProvider, registerUser, login} from "../controllers/authController";

router.post('/UserRegister', registerUser)
router.post('/ProviderRegister', registerProvider)
router.post('/login',login)

export default router