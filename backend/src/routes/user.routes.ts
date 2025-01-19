import Router from 'express';
import UserController from '@src/app/controllers/UserController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';


const routes = Router();

routes.get('/', UserController.findUsers);
routes.post('/', UserController.create);
routes.get('/:id', ensureAuthenticated, UserController.findUserById);
routes.delete('/:id', ensureAuthenticated, UserController.delete);
routes.put('/:id', ensureAuthenticated, ensureProfile, UserController.update);
routes.put('/update-password/:id', ensureAuthenticated, ensureProfile, UserController.passwordUpdate);

export default routes;

