import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './logger.js';
import { errorHandler, notFoundHandler, requestLogger } from './middleware.js';
import apiRouter from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;
const logger = new Logger('App');

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api', apiRouter);

// Serve static files
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// 404 handler for API routes
app.use(notFoundHandler);

// Handle SPA routing (must be before error handler)
app.get(/.*/, (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server started successfully`, {
    port,
    env: process.env.NODE_ENV || 'development',
    dbPath: process.env.DB_PATH || 'default'
  });
});
