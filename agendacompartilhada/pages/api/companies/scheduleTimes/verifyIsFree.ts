import { PrismaClient, ScheduleTime } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData =  req.body;
  const clientData = jsonData.client;
  const companyId = jsonData.companyId;
  const contribuitorId = jsonData.contributorId;
  const scheduleTimeData = jsonData.scheduleTime;
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "POST":
      try{    
        const company = await prisma.company.findUnique({
          where: {
            id: companyId
          }
        });

        if(company){ 
          const contribuitors = await prisma.contribuitor.findMany({
            where: {
              companyId: company.id,
            }
          })
          if(contribuitors.length > 0){
              const scheduleTimes = await prisma.scheduleTime.findMany({
                where: {
                  companyId: companyId,
                  date: new Date(scheduleTimeData.date),
                  time: scheduleTimeData.time,
                }
              });
             if(scheduleTimes.length > 0 && contribuitors.length == scheduleTimes.length){
                res.status(200).json({free: false})
              }else {
                res.status(200).json({free: true})
             }
            
          }else{
            res.status(400).json({error: "Empresa sem colaboradores"})
          }
        }else{
          res.status(400).json({error: "Empresa não encontrada"})
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