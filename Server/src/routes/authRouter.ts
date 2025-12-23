import { Router } from "express";
import { registerProvider, registerUserController, login, refresh } from "../controllers/authController";
import { validate } from "../middlewares/validation";
import { loginSchema,providerRegisterSchema,userRegisterSchema } from "../middlewares/zodSchema";

const router = Router();

router.post('/register/user',validate(userRegisterSchema),registerUserController);
router.post('/register/provider',validate(providerRegisterSchema),registerProvider);
// router.post('/verityOtp')
// router.post('/resendOtp')
// router.post('/refresh')
// router.post('/forgotPassword')
router.post('/login',validate(loginSchema),login);
router.post('/refresh',refresh);

export default router;