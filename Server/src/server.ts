import dotenv from 'dotenv'
import app from "./app";
import connectDB from './config/db';

dotenv.config({ debug: true });

const PORT = process.env.PORT || "Port not available";

async function startServer() {
  await connectDB()
  app.listen(PORT,() => {
    console.log(`Server running on port http://localhost:${PORT}`)
  }
  );
}

startServer()

