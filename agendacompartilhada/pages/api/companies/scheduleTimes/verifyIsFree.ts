import { PrismaClient, ScheduleTime } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData = req.body;
  const clientData = jsonData.client;
  const companyId = jsonData.companyId;
  const contribuitorId = jsonData.contributorId;
  const scheduleTimeData = jsonData.scheduleTime;
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "POST":
      try {
        const company = await prisma.company.findUnique({
          where: {
            id: companyId,
          },
        });

        if (company == null) {
          return res.status(400).json({ error: "Empresa não encontrada" });
        }

        const contribuitors = await prisma.contribuitor.findMany({
          where: {
            companyId: company.id,
          },
        });

        if (contribuitors.length == 0) {
          return res.status(400).json({ error: "Empresa sem colaboradores" });
        }

        const scheduleTimes = await prisma.scheduleTime.findMany({
          where: {
            companyId: companyId,
            date: new Date(scheduleTimeData.date),
            time: scheduleTimeData.time,
          },
        });

        const isFull =
          scheduleTimes.length > 0 &&
          contribuitors.length == scheduleTimes.length;

        res.status(200).json({ free: !isFull });
      } catch (error) {
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
