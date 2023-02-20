import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idSlug } = req.query;
  const id = Number(idSlug?.at(0)); 
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "POST":
      break;
    default:
      try{
        const contributorExists = await prisma.contribuitor.findFirst({
          where: {
            id: id
          }
        });
        if(contributorExists){
          const deletedContributor = await prisma.contribuitor.delete({
            where: {
              id: id
            }
          });
          if(deletedContributor){
            res.status(200).json({contributerWasDeleted:true});
          }else{
            res.status(400).json({error: "Não foi possível deletar contribuidor"});
          }
          res.status(200).json({deletedContributor});
        }else{
          res.status(400).json({error: "Usuário não encontrado"});
        }
      }catch(error){
        res.status(400).json({error: error});
      }finally{
        res.end();
        await prisma.$disconnect();
      }
      break;
  }
}