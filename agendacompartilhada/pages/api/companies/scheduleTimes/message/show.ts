// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
const jwt = require('jsonwebtoken');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case "POST":
      const jsonData =  req.body;
      const prisma = new PrismaClient();
      await prisma.$connect()
      try {
        const company = await prisma.company.findUnique({
          where:{
            id: jsonData.companyId
          }
        });
        if(company){
          const scheduleTimes = await prisma.scheduleTime.findMany({
            where: {
              companyId: company.id,
              date: {gte: new Date(jsonData.date)}
            }
          });
          if(scheduleTimes.length > 0){
            let scheduleTimeIds = scheduleTimes.map(scheduleTime => scheduleTime.id)
            let messages = await prisma.message.findMany(({
              where:{
                scheduleTimeId: {in: scheduleTimeIds},
                readed: false,
              }
            }));
            if(messages.length > 0){
              res.status(200).json({messages});
            }else{
              res.statusMessage = "Sem avisos";
              res.status(400).json({error: "Sem avisos"});
            }
          }else{
            res.statusMessage = "Não encontrou horários marcados";
            res.status(400).json({error: "Não encontrou horários marcados"});
          }
        }else{
          res.statusMessage = "Não encontrou empresa";
          res.status(400).json({error: "Não encontrou empresa"});
        }
        const message = await prisma.message.create({
          data: {
            content: jsonData.message,
            scheduleTimeId: jsonData.scheduleTimeId
          }
        });
        if (message) {
          res.statusMessage = "Mensagem enviada com sucesso";
          res.status(200).json({message})
        } else {
          res.statusMessage = "Erro ao mandar mensagem";
          res.status(400).json({error: "Erro ao mandar mensagem"});
        }
      } catch (error) {
        res.statusMessage = "Erro ao mandar mensagem";
        res.status(400).json({ error:error });
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