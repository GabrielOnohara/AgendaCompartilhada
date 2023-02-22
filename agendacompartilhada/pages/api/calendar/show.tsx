// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case "POST":
      const jsonData =  req.body;
      const prisma = new PrismaClient();
      await prisma.$connect()
      try {
        const calendar = await prisma.calendar.findFirst({
          where: {
            companyId: jsonData.id,
          }
        });
        if (calendar) {
          res.statusMessage = "Agenda encontrada com sucesso";
          res.status(200).json({calendar});
        } else {
          res.statusMessage = "Nenhuma agenda encontrado";
          res.status(400);
        }
      } catch (error) {
        res.statusMessage = "Não foi possível obter agenda";
        res.status(400).json({ error:error });
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