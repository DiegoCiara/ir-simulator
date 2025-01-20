import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';
import Declaration from '@entities/Declaration';
import User from '@entities/User';

interface DeclarationInterface {
  year: string;
  values: {
    rent: number;
    deduction: number
  };
  status?: string;
}

const optionalFields = ['observation'];

class DeclarationController {
  public async findDeclarations(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const declarations = await Declaration.find({
        order: { year: 'DESC' },
        where: { user },
        relations: ['user']
      });

      console.log(declarations)
      res.status(200).json(declarations);
    } catch (error) {
      console.error(error)
      res.status(400).json({
        error: 'Erro ao procurar declaraçãos, tente novamente mais tarde',
      });
    }
  }

  public async findDeclarationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const declaration = await Declaration.findOne(id);

      if (!declaration) {
        res.status(404).json({ message: 'Declaração não existe' });
        return;
      }

      res.status(200).json(declaration);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao buscar declaração, tente novamente' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const {
        year,
        values
      }: DeclarationInterface = req.body;

      if (!year || !values) {
        res.status(400).json({ message: 'Valores inválidos para criação do usuário' });
        return;
      }

      const declaration = await Declaration.create({
        year,
        values,
        user
      }).save();

      if (!declaration) {
        res.status(400).json({
          message: 'Não foi possível criar a declaração, tente novamente',
        });
        return;
      }

      res.status(201).json({ id: declaration.id });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Falha no registro, tente novamente' });
    }
  }
  public async retificate(req: Request, res: Response): Promise<void> {
    try {

      const id = req.params.id
      if (!id) {
        res.status(404).json({ message: 'ID não informado.' });
        return;
      }

      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const retificate = await Declaration.findOne(id);

      if (!retificate) {
        res.status(404).json({ message: 'Declaração não encontrado.' });
        return;
      }

      const {
        year,
        values,
      }: DeclarationInterface = req.body;

      if (!year || !values) {
        res.status(400).json({ message: 'Valores inválidos para criação do usuário' });
        return;
      }

      const declaration = await Declaration.create({
        year,
        values,
        user,
        retificate,
        has_retificate: true,
      }).save();

      if (!declaration) {
        res.status(400).json({
          message: 'Não foi possível criar a declaração, tente novamente',
        });
        return;
      }

      res.status(201).json({ id: declaration.id });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Falha no registro, tente novamente' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        year,
        values,
        status,
      }: DeclarationInterface = req.body;

      const declaration = await Declaration.findOne(id);

      if (!declaration) {
        res.status(404).json({ message: 'Declaração não encontrada.' });
        return;
      }

      const valuesToUpdate = {
        year: year || declaration.year,
        values: values || declaration.values,
        status: status || declaration.status,
      };

      await Declaration.update(declaration.id, { ...valuesToUpdate });

      res.status(200).json();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Falha ao atualizar, tente novamente.' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const declaration = await Declaration.findOne(id);

      if (!declaration) {
        res.status(404).json({ message: 'Declaração não encontrada.' });
        return;
      }

      await Declaration.softRemove(declaration);

      res.status(200).json({ message: 'Declaração deletada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Falha ao atualizar, tente novamente.' });
    }
  }
}

export default new DeclarationController();
