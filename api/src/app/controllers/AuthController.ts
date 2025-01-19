import User from '@entities/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { generateToken } from '@utils/generateToken';
dotenv.config();

interface UserInterface {
  name: string;
  email: string;
  token: string;
  password: string;
  client: string;
}

class AuthController {
  public async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: UserInterface = req.body;

      console.log(req.body);

      if (!email || !password) {
        res.status(400).json({ message: 'Valores inválidos para o usuário' });
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: 'E-mail inválido!' });
        return;
      }

      if (!(await bcrypt.compare(password, user.passwordHash))) {
        res.status(404).json({ message: 'Senha inválida!' });
        return;
      }

      const token = generateToken({ id: user.id });

      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token,
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Falha na autenticação, tente novamente' });
    }
  }
}

export default new AuthController();