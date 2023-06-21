// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { json } from "stream/consumers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PATCH":
      const jsonData = req.body;
      const prisma = new PrismaClient();
      await prisma.$connect();
      try {
        const message = await prisma.message.update({
          where: {
            id: jsonData.id,
          },
          data: {
            readed: jsonData.readed
          }
        });
        if (message) {
          res.statusMessage = "Mensagem atualizada com sucesso";
          res.status(200);
        } else {
          res.statusMessage = "Não encontrou mensagem";
          res.status(400).json({ error: "Não encontrou mensagem" });
        }

      } catch (error) {
        res.statusMessage = "Erro: " + error;
        res.status(400).json({ error: error });
        throw error
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
