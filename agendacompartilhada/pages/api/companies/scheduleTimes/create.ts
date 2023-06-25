import { PrismaClient, ScheduleTime } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData = req.body;
  // const data = {
  //   client: {
  //     email: clientEmail,
  //     name: clientName,
  //     phone: clientPhone,
  //   },
  //   companyId: company.id,
  //   contributorId: contributorId,
  //   scheduleTime: {
  //     date: dayjs(selectedScheduleDay).format('YYYY-MM-DD'),
  //     time: selectedScheduleTime,
  //     duration: calendar.intervalTime,
  //   },
  // }
  const clientData = jsonData.client;
  const companyId = jsonData.companyId;
  const contribuitorId = jsonData.contributorId;
  const scheduleTimeData = jsonData.scheduleTime;
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "POST":
      try {
        await prisma.$transaction(async (prisma) => {
          const company = await prisma.company.findUnique({
            where: {
              id: companyId,
            },
          });

          if (company == null) {
            throw new Error("Empresa não encontrada");
          }

          const contribuitor = await prisma.contribuitor.findUnique({
            where: {
              id: contribuitorId,
            },
          });

          if (contribuitor == null) {
            throw new Error("Profissional não encontrado");
          }

          let client = await prisma.client.findUnique({
            where: {
              email: clientData.email,
            },
          });

          if (client == null) {
            try {
              client = await prisma.client.create({
                data: {
                  email: clientData.email,
                  name: clientData.name,
                  phone: clientData.phone,
                },
              });
            } catch (error) {
              throw new Error("Não foi possível cadastrar cliente");
            }
          }

          const scheduleTime = await prisma.scheduleTime.findFirst({
            where: {
              contribuitorId: contribuitor.id,
              companyId: companyId,
              date: new Date(scheduleTimeData.date),
              time: scheduleTimeData.time,
            },
          });

          if (scheduleTime) {
            throw new Error("Horário indisponível, atualize a página.");
          }

          try {
            const newScheduleTime = await prisma.scheduleTime.create({
              data: {
                companyId: company.id,
                date: new Date(scheduleTimeData.date),
                time: scheduleTimeData.time,
                duration: scheduleTimeData.duration,
                clientId: client.id,
                contribuitorId: contribuitor.id,
              },
            });
            res.status(200).json({ newScheduleTime });
          } catch (error) {
            throw new Error("Não foi possível agendar horário");
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          error = error.message;
        }
        res.status(400).json({ error: error });
        throw error;
      } finally {
        res.end();
        await prisma.$disconnect();
      }
      break;
    default:
      res.status(200).json({ name: "John Doe" });
      break;
  }
}
