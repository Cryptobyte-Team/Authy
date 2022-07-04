import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Models
import { User, UserDoc } from '../models/user';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const jwtKey = process.env.JWT_SECRET;

export const generateAuthToken = (user: UserDoc): string => {
  const token = jwt.sign({ _id: user._id, email: user.email }, jwtKey, {
    expiresIn: '2h'
  });

  return token;
};

export const verifyToken = (token: string): { _id: string; email: string } => {
  try {
    const tokenData = jwt.verify(token, jwtKey);
    
    return tokenData as { 
      _id: string; 
      email: string 
    };

  } catch (error) {
    throw new Error('Unauthorized');
  }
};

export const isAuthenticated = (req: AuthenticatedRequest<any>, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith('Bearer')) {
    const token = auth.slice(7);

    try {
      const tokenData = verifyToken(token);
      
      User.findById(tokenData._id, (err: Error, user: UserDoc) => {
        if ((err) || (!user)) {
          return res.status(401).send({
            errors: ['Unauthorized']
          });
        }

        req.user = user;
        next();
      });

    } catch (error) {
      return res.status(401).send({
        errors: ['Unauthorized']
      });
    }

  } else {
    return res.status(401).send({
      errors: ['Unauthorized']
    });
  }
};
