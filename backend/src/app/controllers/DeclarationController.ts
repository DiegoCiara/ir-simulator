import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';
import Declaration from '@entities/Declaration';
import User from '@entities/User';

interface DeclarationInterface {
  year: string;
  values: {
    rent: number;
    deduction: number;
  };
  status?: string;
}

/**
 * @swagger
 * tags:
 *   name: Declarações
 *   description: Operações relativas às declarações
 */

class DeclarationController {

  /**
   * @swagger
   * /declaration:
   *   get:
   *     summary: Retorna todas as declarações de um usuário autenticado
   *     tags: [Declarações]
   *     responses:
   *       200:
   *         description: Declarações encontradas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   year:
   *                     type: string
   *                   values:
   *                     type: object
   *                     properties:
   *                       rent:
   *                         type: number
   *                       deduction:
   *                         type: number
   *       401:
   *         description: Usuário não encontrado ou token inválido
   *       500:
   *         description: Erro ao procurar declarações
   */
  public async findDeclarations(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const declarations = await Declaration.find({
        order: { year: 'DESC', createdAt: 'DESC' },
        where: { user },
        relations: ['user'],
      });

      res.status(200).json(declarations);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar declarações, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /declaration/{id}:
   *   get:
   *     summary: Retorna uma declaração específica pelo ID
   *     tags: [Declarações]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da declaração
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Declaração encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 year:
   *                   type: string
   *                 values:
   *                   type: object
   *                   properties:
   *                     rent:
   *                       type: number
   *                     deduction:
   *                       type: number
   *       404:
   *         description: Declaração não encontrada
   *       500:
   *         description: Erro ao buscar declaração
   */
  public async findDeclarationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const declaration = await Declaration.findOne(id);

      if (!declaration) {
        res.status(404).json({ message: 'Declaração não encontrada.' });
        return;
      }

      res.status(200).json(declaration);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar declaração, tente novamente' });
    }
  }


  /**
   * @swagger
   * /declaration:
   *   post:
   *     summary: Cria uma nova declaração para o usuário autenticado
   *     tags: [Declarações]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               year:
   *                 type: string
   *               values:
   *                 type: object
   *                 properties:
   *                   rent:
   *                     type: number
   *                   deduction:
   *                     type: number
   *     responses:
   *       201:
   *         description: Declaração criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para criação da declaração
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar a declaração
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const { year, values }: DeclarationInterface = req.body;

      if (!year || !values) {
        res.status(400).json({ message: 'Dados inválidos para criação da declaração.' });
        return;
      }

      const declaration = await Declaration.create({
        year,
        values,
        user,
      }).save();

      res.status(201).json({ id: declaration.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar a declaração, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /declaration/rectified/{id}:
   *   post:
   *     summary: Cria uma retificação de uma declaração
   *     tags: [Declarações]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da declaração a ser retificada
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               year:
   *                 type: string
   *               values:
   *                 type: object
   *                 properties:
   *                   rent:
   *                     type: number
   *                   deduction:
   *                     type: number
   *     responses:
   *       201:
   *         description: Retificação criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para retificação
   *       404:
   *         description: Declaração não encontrada
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar a retificação
   */

  public async rectified(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ message: 'ID da declaração não informado.' });
        return;
      }

      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const rectified = await Declaration.findOne(id);

      if (!rectified) {
        res.status(404).json({ message: 'Declaração não encontrada.' });
        return;
      }

      const { year, values }: DeclarationInterface = req.body;

      if (!year || !values) {
        res.status(400).json({ message: 'Dados inválidos para retificação da declaração.' });
        return;
      }

      const declaration = await Declaration.create({
        year,
        values,
        user,
        rectified,
        has_rectified: true,
      }).save();

      res.status(201).json({ id: declaration.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar a retificação, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /declaration/{id}:
   *   put:
   *     summary: Atualiza uma declaração existente
   *     tags: [Declarações]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da declaração a ser atualizada
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               year:
   *                 type: string
   *               values:
   *                 type: object
   *                 properties:
   *                   rent:
   *                     type: number
   *                   deduction:
   *                     type: number
   *               status:
   *                 type: string
   *     responses:
   *       204:
   *         description: Declaração atualizada com sucesso
   *       404:
   *         description: Declaração não encontrada
   *       500:
   *         description: Erro ao atualizar a declaração
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { year, values, status }: DeclarationInterface = req.body;

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

      res.status(204).json({ message: 'Declaração atualizada com sucesso.'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar a declaração, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /declaration/{id}:
   *   delete:
   *     summary: Deleta uma declaração existente
   *     tags: [Declarações]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID da declaração a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Declaração deletada com sucesso
   *       404:
   *         description: Declaração não encontrada
   *       401:
   *         description: Não é possível remover declarações submetidas
   *       500:
   *         description: Erro ao deletar a declaração
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const declaration = await Declaration.findOne(id);

      if (!declaration) {
        res.status(404).json({ message: 'Declaração não encontrada.' });
        return;
      }

      if (declaration.status === 'SUBMITED') {
        res.status(401).json({ message: 'Não é possível remover declarações submetidas.' });
        return;
      }

      await Declaration.softRemove(declaration);

      res.status(204).json({ messsage: 'Declaração deletada com sucesso.'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao deletar a declaração, tente novamente.' });
    }
  }
}

export default new DeclarationController();