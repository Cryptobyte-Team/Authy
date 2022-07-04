import express, { Router } from 'express';
import { rateLimits } from '../utils/limiter';

// Routes
import v1 from './v1';

const router: Router = express.Router();

router.use('/v1', rateLimits.standard, v1);

export default router;