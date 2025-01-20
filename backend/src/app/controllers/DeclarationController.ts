import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';
import Declaration from '@entities/Declaration';
import { validateRequestBody } from '@utils/validateRequestBody';

interface Income {
  wage: number;
  rent: number;
  investments: number;
  others: number;
}

interface Dependents {
  name: string;
  age: number;
  relationship: string;
}

interface MaterialGoods {
  type: string;
  description: string;
  value: number;
  acquisition_date: Date;
  location: string;
}

interface DeclarationInterface {
  year: string;
  income: Income;
  dependents: Dependents[];
  direct_goods: MaterialGoods[];
  observation?: string;
}

const requiredFields = [
  'year',
  'income',
  'dependents',
  'direct_goods',
];

const optionalFields = ['observation'];

class DeclarationController {
  public async findDeclarations(req: Request, res: Response): Promise<void> {
    try {
      const declarations = await Declaration.find({
        order: { createdAt: 'DESC' },
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
      const {
        year,
        income,
        dependents,
        direct_goods,
        observation,
      }: DeclarationInterface = req.body;

      const validationError = validateRequestBody(
        req.body,
        requiredFields,
        optionalFields,
      );
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const declaration = await Declaration.create({
        year,
        income,
        dependents,
        direct_goods,
        observation,
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
        income,
        dependents,
        direct_goods,
        observation,
      }: DeclarationInterface = req.body;

      const declaration = await Declaration.findOne(id);

      if (!declaration) {
        res.status(404).json({ message: 'Declaração não encontrada.' });
        return;
      }

      const valuesToUpdate = {
        year: year || declaration.year,
        income: income || declaration.income,
        dependents: dependents || declaration.dependents,
        direct_goods: direct_goods || declaration.direct_goods,
        observation: observation || declaration.observation,
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
