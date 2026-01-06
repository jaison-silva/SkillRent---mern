// route aggregator 
import {rateLimiter} from '../middlewares/rateLimiterMiddleware'
import userRouter from './userRouter'
import providerRouter from './providerRouter'
import authRouter from './authRouter'
import adminRouter from './adminRouter'

import { Router } from "express";
const router = Router()

router.use('/auth',rateLimiter,authRouter)
router.use('/users',rateLimiter,userRouter)
router.use('/providers',rateLimiter,providerRouter)
router.use('/admin',rateLimiter,adminRouter)

export default router