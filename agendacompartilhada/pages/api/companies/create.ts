// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch(req.method){
    case "POST":
      const data =  req.body;
      res.status(200).json(data);
      break;
    default:
       res.status(200).json({ name: 'John Doe' });
      break
  }
}