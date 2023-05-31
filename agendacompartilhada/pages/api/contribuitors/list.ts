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
        const contribuitors = await prisma.contribuitor.findMany({
          where: {
            companyId: jsonData.id,
          },
        });
        if (contribuitors.length > 0) {
          res.statusMessage = "Contribuidores encontrados com sucesso";
          res.status(200).json({ contribuitors });
        } else {
          res.statusMessage = "Nenhum contribuidor encontrado";
          res.status(400);
        }
      } catch (error) {
        res.statusMessage = "Não foi possível obter contribuidores";
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
