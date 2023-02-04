import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
          var passwordsMatch = bcrypt.compareSync(data.password, user.password); 
          if(passwordsMatch){
            const token = jwt.sign({user}, process.env.JWT_KEY, {expiresIn: 60*60});
            res.statusMessage = "Login efetuado com sucesso";
            res.status(200).json({jwt:process.env.JWT_KEY});
          }else{
            res.statusMessage = "Senha inválida";
            res.status(400);
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
      res.status(200).json({ name: 'John Doe' });
      break;
  }

}