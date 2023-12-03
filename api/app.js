import express from 'express';
import { exec } from 'child_process';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import userRouter from './routes/user.route.js';
import path from 'path';

import APPError from './utils/appError.js';
const app = express();

app.use(morgan('dev'));

//bodyparser
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello server');
});
app.get('/run_script', (req, res) => {
  // Run your script here
  const scriptPath =
    'C:\\Users\\Subhajit kundu\\Desktop\\railway-monitoring-system\\api\\weapon.py';
  const scriptDirectory = path.dirname(scriptPath);

  // Change the working directory
  process.chdir(scriptDirectory);
  exec(`python "${scriptPath}"`, (err, stdout, stderr) => {
    
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.send(stdout);
  });
});

app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  return next(new APPError(`No url match to ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);
export default app;
