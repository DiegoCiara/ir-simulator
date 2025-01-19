import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import Users from '@entities/User';
import emailValidator from '@utils/emailValidator';
import User from '@entities/User';

interface UserInterface {
  id?: string;
  name: string;
  email: string;
  token: string;
  password: string;
  client: string;
}

class UserController {
  public async findUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json(users); // Retorno é feito aqui via res
    } catch (error) {
      res.status(400).json({
        error: 'Erro ao procurar usuários, tente novamente mais tarde',
      });
    }
  }

  public async findUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await Users.findOne(id);

      if (!user) {
        res.status(404).json({ message: 'Usuário não existe' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar usuário, tente novamente' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password }: UserInterface = req.body;

      if (!email || !emailValidator(email)) {
        res.status(400).json({ message: 'Valores inválidos para o novo usuário!' });
        return;
      }

      const findUser = await Users.findOne({ where: { email } });

      if (findUser) {
        res.status(400).json({ message: 'Este usuário já existe' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await Users.create({
        name,
        email,
        passwordHash,
      }).save();

      if (!user) {
        res.status(400).json({
          message: 'Não foi possível criar o usuário, tente novamente',
        });
        return;
      }

      res.status(201).json({ id: user.id }); // Envia a resposta após a criação
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Falha no registro, tente novamente' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email }: UserInterface = req.body;

      if ((email && !emailValidator(email)) || !email) {
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

      res.status(200).json(); // Não é necessário retornar nada no corpo
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Falha ao atualizar, tente novamente.' });
    }
  }

  public async passwordUpdate(req: Request, res: Response): Promise<void> {
    try {
      const { oldPassword, newPassword } = req.body;
      const id = req.params.id;

      if (!oldPassword || !newPassword) {
        res.status(400).json({ message: 'Valores inválidos para atualizar a senha' });
        return;
      }

      const user = await Users.findOneOrFail(id);

      if (!(await bcrypt.compare(oldPassword, user.passwordHash))) {
        res.status(404).json({ message: 'Senha inválida' });
        return;
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await Users.update(id, { passwordHash });

      res.status(200).json(); // Enviar resposta com status 200 sem corpo
    } catch (error) {
      res.status(400).json({
        error: 'Falha ao atualizar a senha, verifique os valores e tente novamente',
      });
    }
  }
}

export default new UserController();