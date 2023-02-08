import type { NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case "POST":
      try {
        res.statusMessage = "Logout efetuado com sucesso";
        res.status(200).json({ auth: false, token: null });
      } catch (error) {
        res.statusMessage = "Não foi possível efetuar o logout";
        res.status(400).json({error});
      }
      break;
    default:
      res.status(200).json({ name: 'John Doe' });
      break;
  }
}