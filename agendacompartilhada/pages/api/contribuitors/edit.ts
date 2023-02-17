// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case "PATCH":
      const jsonData =  req.body;
      const prisma = new PrismaClient();
      await prisma.$connect()
      try {
        let contributorExists = await prisma.contribuitor.findUnique({
          where: {
            id: +jsonData.id,
          }
        });
        if (contributorExists) {
            let contributorEdited = await prisma.contribuitor.update({
              where: {
                id: +jsonData.id
              },
              data: jsonData
            });
            if(contributorEdited){
              res.statusMessage = "Contribuidores editado com sucesso";
              res.status(200).json({contributorEdited});
            }else{
              res.statusMessage = "Edição inválida";
              res.status(200).json({contributorEdited});
            }
        
        } else {
          res.statusMessage = "Nenhum contribuidor encontrado";
          res.status(400);
        }
      } catch (error) {
        res.statusMessage = "Não foi possível editar contribuidor";
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