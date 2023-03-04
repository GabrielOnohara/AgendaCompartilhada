import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const id = query["id"] as string; 
  const prisma = new PrismaClient();
  await prisma.$connect()
  switch(req.method){
    case "POST":
      break;
    default:
      try{
        const company = await prisma.company.findUnique({
          where: {
            id: parseInt(id??'0')
          }
        });
        if(company){
          const {password, ...newCompany} = company;
          const calendar = await prisma.calendar.findUnique({
            where: {
              companyId: parseInt(id??'0')
            }
          });
          const contributors = await prisma.contribuitor.findMany({
            where: {
              companyId: parseInt(id??'0')
            }
          });
          res.status(200).json({newCompany, calendar, contributors});
        }else{
          res.status(400).json({error: "Empresa não encontrada",});
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