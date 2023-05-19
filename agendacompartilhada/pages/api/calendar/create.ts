// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const jsonData = req.body;
      const prisma = new PrismaClient();
      await prisma.$connect();
      try {
        const calendar = await prisma.calendar.findFirst({
          where: {
            companyId: jsonData.companyId,
          },
        });
        if (calendar) {
          res.statusMessage = "Calendário já existente";
          res.status(400);
        } else {
          const newCalendar = await prisma.calendar.create({
            data: jsonData,
          });
          res.statusMessage = "Calendário criado com sucesso";
          res.status(200).json({ newCalendar });
        }
      } catch (error) {
        res.statusMessage = "Não foi possível criar calendário.";
        res.status(400).json({ error: error });
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
