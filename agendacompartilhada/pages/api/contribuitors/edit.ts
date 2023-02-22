// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Contribuitor, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { json } from 'stream/consumers';

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
        const contributorExists:any = await prisma.contribuitor.findUnique({
          where: {
            id: jsonData.id,
          }
        });
        if (contributorExists) {
            let changedProperties:any = {}
            Object.keys(contributorExists).forEach((key)=>{
              if(jsonData.hasOwnProperty(key)){
                if(jsonData[key] != contributorExists[key]){
                  changedProperties[key]= jsonData[key];
                }
              }
            })
            let contributorEdited = await prisma.contribuitor.update({
              where: {
                id: jsonData.id
              },
              data: changedProperties
            });
            if(contributorEdited){
              res.statusMessage = "Contribuidores editado com sucesso";
              res.status(200).json({contributorEdited});
            }else{
              res.statusMessage = "Edição inválida";
              res.status(400);
            }
        
        } else {
          res.statusMessage = "Nenhum contribuidor encontrado";
          res.status(400);
        }
      } catch (error) {
        throw error;
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