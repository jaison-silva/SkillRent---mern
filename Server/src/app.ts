import express from 'express'
import cors from 'cors'
import loggerMiddleware from './utils/reqLogger'
import corsOptions from './config/cors'
import router from './routes/index'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())

app.use(cors(corsOptions))

app.use(express.json())

app.use('/',loggerMiddleware,router)

export default app 