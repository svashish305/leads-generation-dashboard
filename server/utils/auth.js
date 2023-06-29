import jwt from 'jsonwebtoken';
import { TOKEN_EXPIRY } from '../config/constants.js';

export const createSecretToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRY,
  });
};