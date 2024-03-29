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
        const message = await prisma.message.create({
          data: {
            content: jsonData.message,
            scheduleTimeId: jsonData.scheduleTimeId,
          },
        });
        res.statusMessage = "Mensagem enviada com sucesso";
        res.status(200).json({ message });
      } catch (error) {
        res.statusMessage = "Erro ao mandar mensagem";
        console.log(error);
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
