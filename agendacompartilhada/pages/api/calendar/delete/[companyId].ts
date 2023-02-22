import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const id = query["companyId"] as string; 
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "DELETE":
      try{
        const calendarExists = await prisma.calendar.findUnique({
          where: {
            companyId: parseInt(id??"0")
          }
        });
        if(calendarExists){
          const deletedCalendar = await prisma.calendar.delete({
            where: {
              companyId: parseInt(id??"0")
            }
          });
          if(deletedCalendar){
            res.status(200).json({deletedCalendar});
          }else{
            res.status(400).json({error: "Não foi possível deletar agenda", query});
          }
        }else{
          res.status(400).json({error: "Agenda não encontrada", query});
        }
      }catch(error){  
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