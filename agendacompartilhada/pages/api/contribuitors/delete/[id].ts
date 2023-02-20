import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idSlug } = req.query;
  const id = idSlug?.at(0) as string; 
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "DELETE":
      try{
        const contributorExists = await prisma.contribuitor.findUnique({
          where: {
            id: +id
          }
        });
        if(contributorExists){
          const deletedContributor = await prisma.contribuitor.delete({
            where: {
              id: +id
            }
          });
          if(deletedContributor){
            res.status(200).json({contributorWasDeleted:true});
          }else{
            res.status(400).json({error: "Não foi possível deletar contribuidor"});
          }
        }else{
          res.status(400).json({error: "Usuário não encontrado"});
        }
      }catch(error){
        throw error
        res.status(400).json({error: error});
      }finally{
        res.end();
        await prisma.$disconnect();
      }
      break;
    default:
      res.status(200).json({ name: 'John Doe' });
      break;
  }
}