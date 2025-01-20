import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Users from '@entities/User';
import emailValidator from '@utils/emailValidator';
import User from '@entities/User';
import speakeasy from 'speakeasy';

import qrcode from 'qrcode';
import { generateToken } from '@utils/generateToken';

interface UserInterface {
  id?: string;
  name: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
}

class UserController {
  public async findUserById(req: Request, res: Response): Promise<void> {
    try {
      /**
       * @swagger
       * /user/:id:
       *   get:
       *     summary: Retorna o usuário procurado pelo id
       *     responses:
       *       200:
       *         description: Consulta de usuário por ID
       */

      const { id } = req.params;

      const user = await Users.findOne(id);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password }: UserInterface = req.body;

      if (!email || !emailValidator(email)) {
        res
          .status(400)
          .json({ message: 'Valores inválidos para o novo usuário.' });
        return;
      }

      const findUser = await Users.findOne({ where: { email } });

      if (findUser) {
        res.status(409).json({ message: 'Usuário já existe.' }); // 409: Conflito
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const secret = speakeasy.generateSecret({
        name: `IR Simulator: ${email}`,
      });

      const user = await Users.create({
        name,
        email,
        passwordHash,
        secret: secret.base32,
      }).save();

      if (!user) {
        res.status(500).json({
          message: 'Erro interno ao criar o usuário, tente novamente.',
        });
        return;
      }

      res.status(201).json({ id: user.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno no registro, tente novamente.' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email }: UserInterface = req.body;

      if (email && !emailValidator(email)) {
        res.status(400).json({ message: 'Formato de e-mail inválido.' });
        return;
      }

      const user = await Users.findOne(id);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const valuesToUpdate = {
        name: name || user.name,
        email: email || user.email,
      };

      await Users.update(user.id, { ...valuesToUpdate });

      res.status(204).send(); // 204: No Content
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro interno ao atualizar o usuário, tente novamente.',
      });
    }
  }
}

export default new UserController();
