import dotenv from 'dotenv';
dotenv.config({ debug: true });

import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
