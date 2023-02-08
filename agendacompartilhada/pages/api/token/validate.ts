import { PrismaClient } from '@prisma/client';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.SECRET, function(err: any) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

    return res.status(200);
  });
  
}
