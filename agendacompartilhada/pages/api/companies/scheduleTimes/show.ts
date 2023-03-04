import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData =  req.body;
  const date = jsonData.date;
  const companyId = jsonData.companyId;
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "POST":
      try{
        const scheduleTimes = await prisma.scheduleTime.findMany({
          where: {
            AND:[
              {companyId: {equals: companyId}},
              {date: {equals: date}}
            ]
          }
        });
        if(scheduleTimes.length > 0){
          res.status(200).json({scheduleTimes});
        }else{
          res.status(200).json({scheduleTimes:[]});
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