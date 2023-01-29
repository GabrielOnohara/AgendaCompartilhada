// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case "POST":
      const data =  req.body;
      const prisma = new PrismaClient();
      try {
        const user = await prisma.company.findFirst({
          where: {
            email: data.email
          }
        })
        if (user) {
          res.statusMessage = "Usuário com o email já existe.";
          res.status(400);
        } else {
          await prisma.company.create({
            data: data
          })
          res.statusMessage = "Usuário criado com sucesso.";
          res.status(200);
        }
      } catch (error) {
        res.statusMessage = "Não foi possível criar usuário.";
        res.status(400).json({ error: error});
      }finally{
        res.end();
      }
      break;
    default:
       res.status(200).json({ name: 'John Doe' });
      break
  }
}