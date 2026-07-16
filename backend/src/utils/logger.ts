import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs/ directory exists inside backend/
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log levels — http sits between info and verbose
const logLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  colors: { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'cyan' },
};

winston.addColors(logLevels.colors);

// Plain format for files
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) =>
    `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
  )
);

// Coloured format for console
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) =>
    `${timestamp} [${level}]: ${stack || message}`
  )
);

const logger = winston.createLogger({
  levels: logLevels.levels,
  level: process.env.LOG_LEVEL || 'http', // log everything http and above
  transports: [
    // Coloured console output
    new winston.transports.Console({ format: consoleFormat }),

    // Error-only log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),

    // HTTP request log file
    new winston.transports.File({
      filename: path.join(logsDir, 'http.log'),
      level: 'http',
      format: fileFormat,
    }),

    // Combined log — everything
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
    }),
  ],
});

export default logger;
