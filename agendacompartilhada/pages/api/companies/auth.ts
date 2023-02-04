import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
var bcrypt = require('bcryptjs');
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch(req.method){
    case "POST":
      const data =  req.body;
      const prisma = new PrismaClient();
      try {
        const user = await prisma.company.findFirst({
          where: {
            email: data.email,
          }
        });
        if(user){
          var hash = bcrypt.hashSync(data.password, 8);
          var passwordsMatch = bcrypt.compareSync(user.password, hash);
          if(passwordsMatch){
            res.statusMessage = "Login efetuado com sucesso";
            res.status(200).json({});
          }else{
            res.statusMessage = "Senha inválida";
            res.status(200);
          }
        }else{
          res.statusMessage = "Email inválido";
          res.status(400);
        }
      } catch (error) {
        res.statusMessage = "Não foi efetuar login";
        res.status(400).json({ error: error});
      }finally {
        res.end();
      }
      break;
    default:
      break;
  }

}