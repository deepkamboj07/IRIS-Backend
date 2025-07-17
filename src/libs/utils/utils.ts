import jwt from 'jsonwebtoken';

export const generateToken = async (payload: object, expiresIn = 10) => {
  return await jwt.sign(payload, process.env.JWT_SECRET as string,{
    expiresIn: expiresIn * 60 * 60, // Convert hours to seconds
  });
};