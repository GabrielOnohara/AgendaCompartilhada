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
            email: jsonData.email,
          },
        });
        if (contribuitor) {
          res.statusMessage = "Usuário com o email já existe.";
          res.status(400);
        } else {
          const newContribuitor = await prisma.contribuitor.create({
            data: jsonData,
          });
          res.statusMessage = "Usuário criado com sucesso";
          res.status(200).json({ newContribuitor });
        }
      } catch (error) {
        res.statusMessage = "Não foi possível criar usuário.";
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
