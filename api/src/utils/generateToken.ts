
import jwt from 'jsonwebtoken';

export function generateToken(params = {}) {
  return jwt.sign(params, `${process.env.SECRET}`, { expiresIn: 84600 });
}
