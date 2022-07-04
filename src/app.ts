import 'dotenv/config';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { exit } from 'process';

// Routes
import routes from './routes';

const app = express();
const port = process.env.PORT || 3001;

let serv: http.Server | null = null;

// Parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json'}));

// Database
mongoose.connect(process.env.DATA, {
  keepAlive: true,
  keepAliveInitialDelay: 300000
});

mongoose.connection.on('connected', () => {
  // Routes
  app.use('/api', routes);

  // Use this if your server is bejind a proxy to make sure 
  // that all backend features work correctly. You can use 
  // the /ip endpoint to adjust the 'trust proxy' setting
  // See: https://expressjs.com/en/guide/behind-proxies.html
  // app.set('trust proxy', 1);

  // If your backend is live and working, comment this out!
  // app.get('/ip', (request, response) => response.send(request.ip));

  // Start backend
  serv = app.listen(port, () => console.info(`Listening @ http://localhost:${port}`));
});

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB Disconnected');

  stop();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB Connection Error', err);

  stop();
});

const stop = (): void => {
  if (serv) {
    serv.close();
  }

  exit(0);
};

export { app, stop };