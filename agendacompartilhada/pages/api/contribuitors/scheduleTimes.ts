import { PrismaClient, ScheduleTime } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData = req.body;
  const contribuitorId = parseInt(jsonData.contribuitorId);
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "POST":
      try {
        const scheduleTimes = await prisma.scheduleTime.findMany({
          where: {
            contribuitorId: contribuitorId,
            date: {
              gt: new Date(jsonData.initialDate),
              lt: new Date(jsonData.endDate),
            },
          },
          orderBy: [{ date: "asc" }],
        });

        const contribuitor = await prisma.contribuitor.findUnique({
          where: {
            id: contribuitorId,
          },
        });

        if (contribuitor) {
          const calendar = await prisma.calendar.findUnique({
            where: {
              companyId: contribuitor?.companyId,
            },
          });

          if (calendar) {
            res
              .status(200)
              .json({ scheduleTimes: scheduleTimes, calendar: calendar });
            return;
          }
        }

        res.status(400).json({
          scheduleTimes: [],
          calendar: null,
        });
      } catch (error) {
        throw error;
        res.status(400).json({ error: error });
      } finally {
        res.end();
        await prisma.$disconnect();
      }
      break;
    case "DELETE":
      try {
        await prisma.scheduleTime.delete({
          where: {
            id: parseInt(jsonData.id),
          },
        });
        res.status(200);
      } catch (error) {
        res.status(404).json({ error: error });
      }
      break;

    default:
      res.status(403);
      break;
  }
}
