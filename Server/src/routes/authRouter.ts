import { Router } from "express";
import { registerProvider, registerUserController, login, refresh } from "../controllers/authController";
import { sendOtpController, verifyOtpController, forgotPasswordController, resetPasswordController } from "../controllers/otpController";
import { validate } from "../middlewares/validationMiddleware";
import { loginSchema, providerRegisterSchema, userRegisterSchema } from "../middlewares/zodSchemaMiddleware";

const router = Router();

router.post('/register/user', validate(userRegisterSchema), registerUserController);
router.post('/register/provider', validate(providerRegisterSchema), registerProvider);
router.post('/login', validate(loginSchema), login);
router.post('/otp/verifyOtp', verifyOtpController)
router.post('/otp/sendOtp', sendOtpController)
router.post('/forgotPassword', forgotPasswordController)
router.post('/forgotPassword/reset', resetPasswordController)
router.post('/refresh', refresh);

export default router;