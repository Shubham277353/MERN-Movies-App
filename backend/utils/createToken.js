// utils/createToken.js
import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
  const token = jwt.sign(
    { userId }, // Payload must match what you verify
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  // Set cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default createToken;