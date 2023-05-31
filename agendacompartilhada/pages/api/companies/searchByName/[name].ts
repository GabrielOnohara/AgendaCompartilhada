import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  if (typeof name !== "string") {
    return res.status(400).json("invalid name");
  }

  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "POST":
      break;
    default:
      try {
        const companies = await prisma.company.findMany({
          where: { name: { startsWith: name } },
        });
        if (companies.length > 0) {
          res.status(200).json({ companies });
        } else {
          res.status(400).json({ error: "Nenhuma empresa encontrada" });
        }
      } catch (error) {
        res.status(400).json({ error: error });
      } finally {
        res.end();
        await prisma.$disconnect();
      }
      break;
  }
}
