import { PrismaClient, ScheduleTime } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = parseInt(req.query["id"] as string);
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "DELETE":
      try {
        await prisma.scheduleTime.delete({
          where: {
            id: id,
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
