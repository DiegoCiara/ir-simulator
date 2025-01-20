import User from '@entities/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { generateToken } from '@utils/generateToken';
import speakeasy from 'speakeasy';

import qrcode from 'qrcode';
import emailValidator from '@utils/emailValidator';
dotenv.config();

interface UserInterface {
  name: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
}

class AuthController {
  public async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: UserInterface = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Valores inválidos para o usuário' });
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado!' });
        return;
      }

      if (!(await bcrypt.compare(password, user.passwordHash))) {
        res.status(404).json({ message: 'Senha inválida!' });
        return;
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        has_configured: user.has_configured
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Falha na autenticação, tente novamente' });
    }
  }

  public async get2FaQrCode(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        console.log('Eo');
        res.status(400).json({
          message: 'Não foi possível encontrar o usuário, tente novamente',
        });
        return;
      }

      const secret = speakeasy.otpauthURL({
        secret: user.secret,
        label: `IR Simulator: ${user.email}`,
        encoding: 'base32',
      });

      const qrCodeUrl = await qrcode.toDataURL(secret!);

      res.status(201).json(qrCodeUrl);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Falha no registro, tente novamente' });
    }
  }

  public async verifySecret(req: Request, res: Response): Promise<void> {
    try {
      const { email, secret }: UserInterface = req.body;

      if (!email || !emailValidator(email) || !secret) {
        res
          .status(400)
          .json({ message: 'Valores inválidos para verificação!' });
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(400).json({
          message: 'Não foi possível criar o usuário, tente novamente',
        });
        return;
      }

      console.log({
        userSec: user.secret,
        token: secret,
      });

      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: secret,
        window: 1,
      });

      if (verified) {
        const token = generateToken({ id: user.id });
        await User.update(user.id, { has_configured: true });
        res.status(201).json({ user: user, token: token });
      } else {
        console.log(verified);
        res
          .status(400)
          .json({ error: 'Falha na verificação, tente novamente' });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Falha no registro, tente novamente' });
    }
  }
}

export default new AuthController();
