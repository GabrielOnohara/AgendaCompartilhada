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
        const contribuitor = await prisma.contribuitor.findFirst({
          where: {
            name: jsonData.contributor,
            companyId: jsonData.companyId
          },
        });
        if (contribuitor) {
          const scheduleTimes = await prisma.scheduleTime.findMany({
            where: {
              contribuitorId: contribuitor.id,
              date: new Date(jsonData.date)
            }
          })
          if(scheduleTimes.length > 0){
            res.statusMessage = "Horários encontrados com sucesso";
            res.status(200).json({ scheduleTimes });
          }else{
            res.statusMessage = "Nenhum horário encontrado";
            res.status(400).json({contribuitor})
          }

        } else {
          res.statusMessage = "Contribuidor não encontrado";
          res.status(400);
        }
      } catch (error) {
        res.statusMessage = "Não foi possível obter horários";
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
