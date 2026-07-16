import { CorsOptions } from "cors"
import logger from "../utils/logger";

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || "")
    .split(',')
    .map(origin => origin.trim().replace(/\/$/, "")); // Trim whitespace and trailing slashes

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        // Remove trailing slash from incoming origin just in case
        const incomingOrigin = origin.trim().replace(/\/$/, "");

        // Locally, allow any localhost or 127.0.0.1 port to bypass strict env checks (useful for vite port switching)
        if (incomingOrigin.startsWith("http://localhost") || incomingOrigin.startsWith("http://127.0.0.1")) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(incomingOrigin)) {
            callback(null, true)
        } else {
            logger.warn(`[CORS REJECTED] Incoming Origin: "${incomingOrigin}" | Allowed: ${JSON.stringify(allowedOrigins)}`);
            callback(new Error("Not allowed by CORS"))
        }
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}

export default corsOptions