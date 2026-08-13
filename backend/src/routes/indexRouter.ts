import { Router } from "express";
import { rateLimiter } from '../middlewares/rateLimiterMiddleware';
import authRouter from './authRouter';
import userRouter from './userRouter';
import providerRouter from './providerRouter';
import adminRouter from './adminRouter';
import publicRouter from './publicRouter';
import chatRouter from './chatRouter';
import agreementRouter from './agreementRouter';

const router = Router();
 
router.use(rateLimiter);
 
router.use('/auth', authRouter);      
router.use('/users', userRouter);       
router.use('/providers', providerRouter);
router.use('/admin', adminRouter);
router.use('/public', publicRouter);
router.use('/chat', chatRouter);
router.use('/agreements', agreementRouter);

export default router;