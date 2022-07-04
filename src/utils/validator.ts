import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as emailValidator  from 'deep-email-validator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBody = (classToConvert: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rsdata = plainToInstance(classToConvert, req.body);
  
    validate(rsdata).then((errors) => {
      if (errors.length > 0) {
        const simplified = 
          errors.reduce((_p, c) => Object.values(c.constraints), []);

        return res.status(400).send({
          errors: simplified
        });
      }

      next();
    });
  };
};

export const validateEmail = async(email: string) => {
  return await emailValidator.validate({
    email: email,
    validateMx: true,
    validateSMTP: true,
    validateTypo: false,
    validateRegex: true,
    validateDisposable: true
  });
};