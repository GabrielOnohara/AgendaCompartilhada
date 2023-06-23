// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

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
        const company = await prisma.company.findFirst({
          where: {
            email: jsonData.email,
          },
        });
        if (company) {
          res.statusMessage = "Usuário com o email já existe.";
          res.status(400);
        } else {
          const newCompany = await prisma.company.create({
            data: jsonData,
          });
          const token = jwt.sign({ newCompany }, process.env.JWT_KEY ?? "", {
            expiresIn: 60 * 60,
          });
          res.statusMessage = "Usuário criado com sucesso";
          res.status(200).json({ newCompany, token });
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
