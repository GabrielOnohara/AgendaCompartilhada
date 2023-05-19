import type { NextApiRequest, NextApiResponse } from "next";
const jwt = require("jsonwebtoken");
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  switch (req.method) {
    case "POST":
      try {
        const token = req.headers["x-access-token"] as string;
        if (!token)
          return res
            .status(401)
            .json({ auth: false, message: "No token provided." });

        jwt.verify(token, process.env.JWT_KEY, function (err: any) {
          if (err)
            return res
              .status(500)
              .json({ auth: false, message: "Failed to authenticate token." });
        });
        res.statusMessage = "Token Válido";
        return res.status(200);
      } catch (error) {
        return res.status(500).json({ auth: false, message: error });
      } finally {
        res.end();
      }
    default:
      res.status(200).json({ name: "John Doe" });
      break;
  }
}
