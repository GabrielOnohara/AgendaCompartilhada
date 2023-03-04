import { PrismaClient, ScheduleTime } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData =  req.body;
  // const data = {
  //   client: {
  //     email: clientEmail,
  //     name: clientName,
  //     phone: clientPhone,
  //   },
  //   companyId: company.id,
  //   contributorId: contributorId, 
  //   sheduleTime: {
  //     date: dayjs(selectedScheduleDay).format('YYYY-MM-DD'),
  //     time: selectedScheduleTime,
  //     duaration: calendar.intervalTime,
  //   },
  // }
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
          const contribuitor = await prisma.contribuitor.findUnique({
            where: {
              id: contribuitorId,
            }
          })
          if(contribuitor){
            const client = await prisma.client.findUnique({
              where: {
                email: clientData.email,
              }
            });
            if(client){
              const scheduleTime = await prisma.scheduleTime.findFirst({
                where: {
                  companyId: companyId,
                  date: new Date(scheduleTimeData.date),
                  time: scheduleTimeData.time,
                }
              });

              if(scheduleTime){
                res.status(400).json({error: "Horário indisponível, atualize a página."});
              }else{
                const newScheduleTime = await prisma.scheduleTime.create({
                  data: {
                    companyId: company.id,
                    date: new Date(scheduleTimeData.date),
                    time: scheduleTimeData.time,
                    duration: scheduleTimeData.duration,
                    clientId: client.id,
                    contribuitorId: contribuitor.id,
                  }
                });
                if(newScheduleTime){
                  res.status(200).json({newScheduleTime});
                }else{
                  res.status(400).json({error: "Não foi possível agendar horário"});
                }
              }
            }else{
              const newClient = await prisma.client.create({
                data: {
                  email:clientData.email,
                  name: clientData.name,
                  phone: clientData.phone,
                }
              });
              if(newClient){
                const newScheduleTime = await prisma.scheduleTime.create({
                  data: {
                    companyId: company.id,
                    date: new Date(scheduleTimeData.date),
                    time: scheduleTimeData.time,
                    duration: scheduleTimeData.duration,
                    clientId: newClient.id,
                    contribuitorId: contribuitor.id,
                  }
                });
                if(newScheduleTime){
                  res.status(200).json({newScheduleTime});
                }else{
                  res.status(400).json({error: "Não foi possível agendar horário"});
                }
              }else{
                res.status(400).json({error: "Não foi possível cadastrar cliente"})
              }
            }
          }else{
            res.status(400).json({error: "Profissional não encontrado"})
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