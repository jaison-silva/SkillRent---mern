import { CorsOptions } from "cors"

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || "").split(',')

const corsOptions: CorsOptions = {
    // origin:allowedOrigins,
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
            console.warn(`access attempt by : ${origin}`)
        }
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}

export default corsOptions