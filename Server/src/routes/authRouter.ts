import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { registerProvider, registerUser, login, refresh } from "../controllers/authController";
import { sendOtp, verifyOtp, forgotPassword, resetPassword } from "../controllers/otpController";
import { validate } from "../middlewares/validationMiddleware";
import { loginSchema, providerRegisterSchema, userRegisterSchema } from "../middlewares/zodSchemaMiddleware";

const router = Router();
router.use(protect); // for checking this jwt ondo and adding it to rhe req 

router.post('/register/user', validate(userRegisterSchema), registerUser);
router.post('/register/provider', validate(providerRegisterSchema), registerProvider);


router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);


router.post('/otp/send', sendOtp);   // Changed from /sendOtp
router.post('/otp/verify', verifyOtp); // Changed from /verifyOtp


router.post('/password/forgot', forgotPassword); // Changed from /forgotPassword
router.post('/password/reset', resetPassword);   // Changed from /forgotPassword/reset

export default router;