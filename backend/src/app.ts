import express from 'express'
import cors from 'cors'
import loggerMiddleware from './utils/reqLogger'
import corsOptions from './config/cors'
import router from './routes/indexRouter'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './middlewares/globalErrorMiddleware'

const app = express()

app.use(cookieParser())

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/',loggerMiddleware,router)

app.use(globalErrorHandler)

export default app 