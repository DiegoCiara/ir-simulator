import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Users from '@entities/User';
import emailValidator from '@utils/emailValidator';
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


/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Operações relativas aos usuários
 */

class UserController {
  /**
   * @swagger
   * /user/{id}:
   *   get:
   *     summary: Retorna o usuário procurado pelo ID
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Usuário encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno
   */
  public async findUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await Users.findOne(req.userId, {
        select: ['id', 'name', 'email', 'createdAt', 'has_configured'],
      });

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

  /**
   * @swagger
   * /user:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Valores inválidos para o novo usuário
   *       409:
   *         description: Usuário já existe
   *       500:
   *         description: Erro interno ao criar o usuário
   */
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
        res
          .status(409)
          .json({
            message: 'Já existe um usuário cadastrado com este e-mail.',
          });
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

      res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno no registro, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /user/{id}:
   *   put:
   *     summary: Atualiza os dados de um usuário
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do usuário a ser atualizado
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       204:
   *         description: Usuário atualizado com sucesso
   *       400:
   *         description: Formato de e-mail inválido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno ao atualizar o usuário
   */
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

      res.status(204).send({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Erro interno ao atualizar o usuário, tente novamente.',
      });
    }
  }
}

export default new UserController();
