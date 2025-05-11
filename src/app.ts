import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { corsOptions, env, rateLimitOptions } from './configAndConstants';

const app = express();

const limiter = rateLimit(rateLimitOptions);

app.use(limiter);
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: '16KB', extended: true }));
app.use(express.json({ limit: '16Kb' }));

app.use('/healthCheck', (_, res) => {
  res.status(200).json({
    statusCode: 200,
    message: 'Server Is Alive : )',
  });
});

const base_url = env.BASE_API_URL;

import { projectRouter, taskRouter, userRouter } from './routes/index.js';
import { authorise, globalErrorHandler, verifyToken } from './middlewares';

app.use(base_url + '/user', userRouter);
app.use(base_url + '/project', verifyToken, authorise('Admin', 'Manager'), projectRouter);
app.use(base_url + '/task', verifyToken, authorise('Admin', 'Manager'), taskRouter);

app.use(globalErrorHandler);

export { app };
