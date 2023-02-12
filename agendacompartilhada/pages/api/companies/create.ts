// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case "POST":
      const data =  req.body;
      const prisma = new PrismaClient();
      await prisma.$connect()
      try {
        const user = await prisma.company.findUnique({
          where: {
            email: data.email
          }
        });
        if (user) {
          res.statusMessage = "Usuário com o email já existe.";
          res.status(400);
        } else {
          const newCompany  = await  prisma.company.create({
            data : data
          })
          const token = jwt.sign({newCompany}, process.env.JWT_KEY, {expiresIn: 60*60});
          res.statusMessage = "Usuário criado com sucesso.";
          res.status(200).json({company:newCompany, token});
        }
      } catch (error) {
        res.statusMessage = "Não foi possível criar usuário.";
        res.status(400).json({ error: error});
      }finally{
        res.end();
        await prisma.$disconnect()
      }
      break;
    default:
       res.status(200).json({ name: 'John Doe' });
      break
  }
}