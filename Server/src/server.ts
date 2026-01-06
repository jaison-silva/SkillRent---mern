import dotenv from 'dotenv'
dotenv.config({ debug: true });

import app from "./app";
import connectDB from './config/db';


const PORT = process.env.PORT || "Port not available";

async function startServer() {
  await connectDB()
  app.listen(PORT,() => {
    console.log(`Server running on port http://localhost:${PORT}`)
  }
  );
}

startServer()

