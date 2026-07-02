import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const LOGS_DIR = path.join(process.cwd(), 'logs');

// Human-readable format for the console
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}]: ${stack ?? message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  // Base format applied to all transports (captures Error stacks)
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),

  transports: [
    // ── Console ──────────────────────────────────────────────────────────────
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        consoleFormat
      )
    }),

    // ── combined.log  (all levels) ────────────────────────────────────────
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'combined.log'),
      format: combine(json()),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 30,             // keep last 30 rotated files
      tailable: true
    }),

    // ── error.log  (errors only) ──────────────────────────────────────────
    new winston.transports.File({
      filename: path.join(LOGS_DIR, 'error.log'),
      level: 'error',
      format: combine(json()),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 30,
      tailable: true
    })
  ],

  // Don't crash the server on uncaught logger exceptions
  exitOnError: false
});

export default logger;
