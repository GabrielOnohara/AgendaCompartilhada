// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from "@prisma/client";
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
            readed: jsonData.readed,
          },
        });
        res.statusMessage = "Mensagem atualizada com sucesso";
        res.status(200);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          res.statusMessage = "Não encontrou mensagem";
          return res.status(404).json({ error: "Não encontrou mensagem" });
        }
        res.statusMessage = "Erro ao atualizar mensagem";
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
