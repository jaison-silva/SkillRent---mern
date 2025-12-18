// route aggregator 

import userRouter from './userRouter'
import authRouter from './authRouter'

import { Router } from "express";
const router = Router()

router.use('/auth',authRouter)
router.use('/users',userRouter)

export default router