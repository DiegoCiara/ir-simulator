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

interface Deductions {
  education: number;
  health: number;
  private_pension: number;
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

interface Debits {
  description: string;
  initial_value: number;
  final_value: number;
}

interface Payments {
  type: string;
  recipient_name: string;
  cpf_or_cnpj: string;
  amount: number;
}

interface Summary {
  total_income: number;
  total_deductions: number;
  tax_due: number;
  tax_paid: number;
  balance: number;
}

// Interface para a declaração, unificando os dados
interface DeclarationInterface {
  year: string;
  income: Income;
  deductions: Deductions;
  dependents: Dependents[];
  direct_goods: MaterialGoods[];
  debts_liabilities: Debits[];
  payments_donations: Payments[];
  summary: Summary;
  additional_information?: {
    foreign_income?: number;
    campaign_donations?: number;
    refund_bank_details?: {
      bank: string;
      agency: string;
      account: string;
    };
  };
}

const requiredFields = [
  'year',
  'income',
  'deductions',
  'dependents',
  'direct_goods',
  'debts_liabilities',
  'payments_donations',
  'summary',
];

const optionalFields = ['additional_information'];

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
        deductions,
        dependents,
        direct_goods,
        debts_liabilities,
        payments_donations,
        summary,
        additional_information,
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
        deductions,
        dependents,
        direct_goods,
        debts_liabilities,
        payments_donations,
        summary,
        additional_information,
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
        deductions,
        dependents,
        direct_goods,
        debts_liabilities,
        payments_donations,
        summary,
        additional_information,
      }: DeclarationInterface = req.body;

      const declaration = await Declaration.findOne(id);

      if (!declaration) {
        res.status(404).json({ message: 'Declaração não encontrada.' });
        return;
      }

      const valuesToUpdate = {
        year: year || declaration.year,
        income: income || declaration.income,
        deductions: deductions || declaration.deductions,
        dependents: dependents || declaration.dependents,
        direct_goods: direct_goods || declaration.direct_goods,
        debts_liabilities: debts_liabilities || declaration.debts_liabilities,
        payments_donations: payments_donations || declaration.payments_donations,
        summary: summary || declaration.summary,
        additional_information: additional_information || declaration.additional_information,
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
