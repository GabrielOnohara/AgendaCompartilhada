import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = parseInt(req.query["id"] as string);
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "GET":
      try {
        const client = await prisma.client.findFirst({
          where: {
            id: id,
          },
        });
        if (client) {
          res.status(200).json({ client: client });
        } else {
          res.status(400).json({ error: "Cliente não encontrado" });
        }
      } catch (error) {
        res.status(400).json({ error: error });
      } finally {
        res.end();
        await prisma.$disconnect();
      }
      break;
    default:
      res.status(405);
      break;
  }
}
