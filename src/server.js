import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import router from './routes/index.js';
import apiDocsRouter from './routes/apiDocs.js';


dotenv.config();

const PORT = Number(env('PORT', '3000')) || process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();
 
  app.use('/', apiDocsRouter);
  
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  app.use(cors());

  app.use(cookieParser()); // Додайте cookie-parser тут, перед використанням роутера

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
