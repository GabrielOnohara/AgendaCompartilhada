import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { json } from "stream/consumers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonData = req.body;
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "POST":
      try {
        const client = await prisma.client.findUnique({
          where: {
            email: jsonData.clientEmail,
          },
        });
        if (client) {
          const scheduleTimes = await prisma.scheduleTime.findMany({
            where: {
              clientId: client.id,
              date: new Date(jsonData.date),
            },
          });
          let companiesIds: number[] = [];
          scheduleTimes.forEach((scheduleTime) => {
            companiesIds.push(scheduleTime.companyId);
          });
          const companies = await prisma.company.findMany({
            where: {
              id: { in: companiesIds },
            },
          });

          if (scheduleTimes.length > 0) {
            res.status(200).json({ scheduleTimes, companies });
          } else {
            res.status(400).json({ error: "Nenhum horário encontrado" });
          }
        } else {
          res.status(400).json({ error: "Email inválido" });
        }
      } catch (error) {
        throw error;
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
