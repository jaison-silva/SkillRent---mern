import { Router } from "express";
import { rateLimiter } from '../middlewares/rateLimiterMiddleware';
import authRouter from './authRouter';
import userRouter from './userRouter';
import providerRouter from './providerRouter';
import adminRouter from './adminRouter';
import publicRouter from './publicRouter';

const router = Router();
 
router.use(rateLimiter);
 
router.use('/auth', authRouter);      
router.use('/users', userRouter);       
router.use('/providers', providerRouter);
router.use('/admin', adminRouter);
router.use('/public', publicRouter);

export default router;