import type { NextApiRequest, NextApiResponse } from 'next'


const KEY = process.env.JWT_KEY;

const Companies = [
  {
    id: 1,
    email: 'example1@example.com',
    password: '123456',
    name: 'Example1',
    phone: '1199999999' // password
  },
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return new Promise( resolve => {
    const method = req.method;
    try {
      switch (method) {
        case "POST":
          const { email, password } = req.body;
          /* Any how email or password is blank */
          if (!email || !password) {
            return res.status(400).json({
              status: 'error',
              error: 'Request missing username or password',
            });
          }
          const user = Companies.find(copany => {
            return copany.email === email;
          });
          /* Check if exists */
          if (!user) {
            /* Send error with message */
            res.status(400).json({ status: 'error', error: 'User Not Found' });
          }

          break;
        default:
          break;
      }
    } catch (error) {
      
    }
  })
  res.status(200).json({ name: 'John Doe' })
}
