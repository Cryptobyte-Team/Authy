import express, { Router, Request, Response } from 'express';
import commonPassworList from 'fxa-common-password-list';
import { nanoid } from 'nanoid';
import { differenceInHours } from 'date-fns';

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
import { mailer } from '../../utils/email';

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

  const code = nanoid();
  const hash = await passwordHash(password);
  const user = new User({
    email,
    password: hash
  });

  // Skip email verification in test mode
  if (process.env.NODE_ENV !== 'test') {
    user.emailCode = code;
    user.emailCodeDate = new Date();

  } else {
    user.emailVerified = true;
  }

  const saved = await user.save();

  // Skip email verification in test mode
  if (process.env.NODE_ENV !== 'test') {
    try {
      const link = `${process.env.PLATFORM_URL}/api/v1/user/verify/${saved._id}?code=${code}`;

      await mailer.sendMail({
        to: email,
        from: `${process.env.PLATFORM_EMAIL}`,
        subject: `Welcome to ${process.env.PLATFORM_NAME}!`,
        body: {
          text: `
            Welcome to ${process.env.PLATFORM_NAME}!

            To verify your email please click or copy this link into your browser:
            ${link}
          `,
          html: `
            <h1>Welcome to ${process.env.PLATFORM_NAME}!</h1>

            <p>
              To verify your email please click the link below
              <br />
              <a rel="noopener" target="_blank" href="${link}">Verify Email</a>
            </p>
          `
        }
      });

    } catch (err) {
      console.error(err);

      return res.status(500).send({
        errors: ['Failed to send verification email']
      });
    }
  }

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

router.get('/verify/:id', rateLimits.high, async(req: Request, res: Response) => {
  const { id } = req.params;
  const { code } = req.query;

  const existing = await User.findById(id);

  if (!existing) {
    return res.status(200).send({}); // Intentionally Ambiguous
  }

  if ((!existing.emailCode) || (!existing.emailCodeDate)) {
    return res.status(200).send({}); // Intentionally Ambiguous
  }

  const maxHours = Number(process.env.MAX_HOURS_VERIFY);
  const hoursSince = differenceInHours(existing.emailCodeDate, new Date());

  if (hoursSince > maxHours) {
    return res.status(401).send({
      errors: ['Email verification link has expired, please request a new one']
    });
  }

  if (existing.emailCode !== code) {
    return res.status(401).send({
      errors: ['Invalid code']
    });
  }

  existing.emailVerified = true;
  existing.emailCode = undefined;
  existing.emailCodeDate = undefined;
  await existing.save();

  return res.status(200).send({});
});

export default router;