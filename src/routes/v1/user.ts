import express, { Router, Request, Response } from 'express';
import commonPassworList from 'fxa-common-password-list';

// Models
import { User } from '../../models/user';

// Dto
import { AuthDto } from './dto';

// Utils
import { comparePassword, passwordHash } from '../../utils/hash';
import { generateAuthToken } from '../../utils/jwt';
import { validateBody, validateEmail } from '../../utils/validator';
import { rateLimits } from '../../utils/limiter';
import { TypedRequest } from '../../types/TypedRequest';

const router: Router = express.Router();

router.post('/signup', rateLimits.high, validateBody(AuthDto), async(req: TypedRequest<AuthDto>, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email: email });

  if (existing) {
    return res.status(500).send({
      errors: ['User with that email already exists']
    });
  }

  const emailValidation = await validateEmail(email);

  if (!emailValidation.valid) {
    const errors = Object.values(emailValidation.validators).reduce((results, item) => {
      if (typeof item.reason === 'string') {
        results.push(`Invalid Email: ${item.reason}`);
      }

      return results;

    }, []);

    return res.status(401).send({
      errors: errors
    });
  }

  if (commonPassworList.test(password)) {
    return res.status(500).send({
      errors: ['Password is too common, please choose a stronger password']
    });
  }

  const hash = await passwordHash(password);
  const user = new User({
    email,
    password: hash,
  });

  const saved = await user.save();
  const token = generateAuthToken(saved);

  return res.status(200).send({
    token: token
  });
});

router.post('/signin', rateLimits.high, validateBody(AuthDto), async(req: TypedRequest<AuthDto>, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email: email });

  if (!existing) {
    return res.status(500).send({
      errors: ['Unauthorized']
    });
  }

  const validPassword = comparePassword(password, existing.password);

  if (!validPassword) {
    return res.status(401).send({
      errors: ['Unauthorized']
    });
  }

  const token = generateAuthToken(existing);

  return res.status(200).send({
    token: token
  });
});

export default router;