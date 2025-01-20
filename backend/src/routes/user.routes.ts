import Router from 'express';
import UserController from '@src/app/controllers/UserController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';


const routes = Router();
routes.get('/:id', ensureAuthenticated, ensureProfile, UserController.findUserById);
routes.put('/:id', ensureAuthenticated, ensureProfile, UserController.update);
routes.post('/', UserController.create);

export default routes;

