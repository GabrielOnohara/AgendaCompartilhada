import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

var bcrypt = require("bcryptjs");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;
  const prisma = new PrismaClient();
  await prisma.$connect();
  switch (req.method) {
    case "POST":
      try {
        const company = await prisma.company.findFirst({
          where: {
            email: data.email,
          },
        });
        if (company) {
          var passwordsMatch = bcrypt.compareSync(
            data.password,
            company.password
          );
          if (passwordsMatch) {
            const token = jwt.sign({ company }, process.env.JWT_KEY ?? "", {
              expiresIn: 60 * 60,
            });
            res.statusMessage = "Login efetuado com sucesso";
            res.status(200).json({ token, company });
          } else {
            res.statusMessage = "Senha inválida";
            res.status(400);
          }
        } else {
          res.statusMessage = "Email não encontrado";
          res.status(400);
        }
      } catch (error) {
        res.statusMessage = "Não foi possível efetuar login";
        res.status(400).json({ error: error });
      } finally {
        res.end();
        await prisma.$disconnect();
      }
      break;
    default:
      try {
        const company = await prisma.company.findFirst({
          where: {
            email: data.email,
          },
        });
        if (company) {
          res.status(200).json({ company });
        } else {
          res.statusMessage = "Usuário não encontrado";
          res.status(400);
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
