import { Request } from 'express';
import { UserDoc } from '../models/user';

export interface AuthenticatedRequest<T> extends Request {
  user: UserDoc
  body: T
}