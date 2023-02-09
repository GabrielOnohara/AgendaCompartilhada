import type {NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  
  switch (req.method) {
    case 'POST':
      try {
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
      
        jwt.verify(token, process.env.JWT_KEY, function(err: any) {
          if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        });
        return res.status(200).json({ auth: true, message: 'Token Válido' });
     
      } catch (error) {
        return res.status(500).json({ auth: false, message: error });
      }finally{
        res.end()
      }
      default:
        res.status(200).json({ name: 'John Doe' });
        break;
  }
}
