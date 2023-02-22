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
        const calendarExists:any = await prisma.calendar.findUnique({
          where: {
            companyId: jsonData.companyId,
          }
        });
        if (calendarExists) {
            let changedProperties:any = {}
            Object.keys(calendarExists).forEach((key)=>{
              if(jsonData.hasOwnProperty(key)){
                if(jsonData[key] != calendarExists[key]){
                  changedProperties[key]= jsonData[key];
                }
              }
            })
            let calendarEdited = await prisma.calendar.update({
              where: {
                companyId: jsonData.companyId
              },
              data: changedProperties
            });
            if(calendarEdited){
              res.statusMessage = "Agenda editada com sucesso";
              res.status(200).json({calendarEdited});
            }else{
              res.statusMessage = "Edição inválida";
              res.status(400);
            }
        
        } else {
          res.statusMessage = "Nenhuma agenda encontrada";
          res.status(400);
        }
      } catch (error) {
        throw error;
      } finally{
        res.end();
        await prisma.$disconnect()
      }
      break;
    default:
       res.status(200).json({ name: 'John Doe' });
      break
  }
}