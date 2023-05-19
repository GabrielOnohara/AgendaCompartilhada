import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const id = query["id"] as string;
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "DELETE":
      try {
        const contributorExists = await prisma.contribuitor.findUnique({
          where: {
            id: parseInt(id ?? "0"),
          },
        });
        if (contributorExists) {
          const deletedContributor = await prisma.contribuitor.delete({
            where: {
              id: parseInt(id ?? "0"),
            },
          });
          if (deletedContributor) {
            res.status(200).json({ contributorWasDeleted: deletedContributor });
          } else {
            res
              .status(400)
              .json({ error: "Não foi possível deletar contribuidor", query });
          }
        } else {
          res.status(400).json({ error: "Usuário não encontrado", query });
        }
      } catch (error) {
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
