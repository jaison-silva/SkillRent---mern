import dotenv from 'dotenv'
import app from "./app";
import connectDB from './config/db';

dotenv.config({ debug: true });

connectDB()

const PORT = process.env.PORT || "Port not available";

app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    );
                                                                                                                                           