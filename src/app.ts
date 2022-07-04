import 'dotenv/config';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// Routes
import routes from './routes';

const app = express();
const port = process.env.PORT || 3001;

let serv: http.Server | null = null;

// Parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));

// Routes
app.use('/api', routes);

if (process.env.NODE_ENV !== 'test') {
  // Database
  mongoose.connect(process.env.DATA, {
    keepAlive: true,
    keepAliveInitialDelay: 300000
  });

  mongoose.connection.on('connected', () => {
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

} else {
  serv = app.listen(port);
}

const stop = async(): Promise<void> => {
  if (serv) {
    await serv.close();
  }
};

export { app, stop };