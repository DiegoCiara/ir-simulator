import Router from 'express';
import UserController from '@src/app/controllers/UserController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';


const routes = Router();
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
routes.post('/', UserController.create);
routes.get('/:id', ensureAuthenticated, UserController.findUserById);
routes.put('/:id', ensureAuthenticated, ensureProfile, UserController.update);

export default routes;

