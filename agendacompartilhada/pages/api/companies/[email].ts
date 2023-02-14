import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { emailSlug } = req.query;
  const email =  emailSlug?.at(0); 
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "POST":
      break;
    default:
      try{
        const company = await prisma.company.findFirst({
          where: {
            email: email
          }
        });
        if(company){
          res.status(200).json({company});
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