import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import validate from "../middlewares/validationMiddleware";
import { loginSchema, providerRegisterSchema, userRegisterSchema } from "../middlewares/zodSchemaMiddleware";
import { AuthController } from "../controllers/authController";
import { authContainer, otpContainer } from "../container/container";
import { OtpController } from "../controllers/otpController";

const router = Router();

const authService = authContainer()
const otpService = otpContainer()

const authController = new AuthController(authService)
const otpController = new OtpController(otpService)

// router.use(protect); // for checking this jwt ondo and adding it to rhe req 
// no need here kariyam onniuum accesstoken vech ahlla oddunne

router.post('/login', validate(loginSchema), authController.login);


router.post('/register/user', validate(userRegisterSchema), authController.registerUser);
router.post('/register/provider', validate(providerRegisterSchema), authController.registerProvider);


router.post('/otp/send', otpController.sendOTP);   // /sendOtp
router.post('/otp/verify', otpController.verifyOTP); // /verifyOtp


router.post('/password/forgot', authController.forgotPassword); // /forgotPassword
router.post('/password/reset', authController.resetPassword);   // /forgotPassword/reset


router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);


export default router;