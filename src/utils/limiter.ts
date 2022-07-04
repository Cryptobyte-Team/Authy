import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';

const store = new MongoStore({
  uri: process.env.DATA,
  expireTimeMs: 15 * 60 * 1000,
  errorHandler: (err: any) => console.error(err),
  collectionName: 'rateLimits'
});

const handler = (req: Request, res: Response) => {
  return res.status(429).send({
    errors: ['Too many requests']
  });
};

const skip = (req: Request, res: Response): boolean => {
  const whitelist = ['::1'];
  const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress;

  return whitelist.includes(ip);
};

const standard = rateLimit({
  store: store,
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler,
  skip: skip
});

const medium = rateLimit({
  store: store,
  max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler,
  skip: skip
});

const high = rateLimit({
  store: store,
  max: 15, // Limit each IP to 15 requests per `window` 
  windowMs: 60 * 60 * 1000, // 60 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler,
  skip: skip
});

export const rateLimits = {
  standard, medium, high
};