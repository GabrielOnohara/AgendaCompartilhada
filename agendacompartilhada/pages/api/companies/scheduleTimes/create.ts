import { PrismaClient, ScheduleTime } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData =  req.body;
  const initialDate = jsonData.initialDate;
  const endDate = jsonData.endDate;
  const companyId = jsonData.companyId;
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "POST":
      try{
        const scheduleTimes = await prisma.scheduleTime.findMany({
          where: {
            AND:[
              {companyId: parseInt(companyId)},
              {
                AND:[
                  {date: {gt: new Date(initialDate)}},
                  {date: {lt: new Date(endDate)}},
                ]
              }
            ]
          }
        });
        
        const scheduleTimesSortedByDate = scheduleTimes.sort( (a: ScheduleTime, b:ScheduleTime)=>{
          if(new Date(a.date) < new Date(b.date)){
            return 1;
          }else{
            return 0;
          }
        })

        if(scheduleTimes.length > 0){
          res.status(200).json({scheduleTimes: scheduleTimesSortedByDate});
        }else{
          res.status(200).json({scheduleTimes:[]});
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