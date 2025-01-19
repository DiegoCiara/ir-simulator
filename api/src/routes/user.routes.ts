import Router from 'express';
import UserController from '@src/app/controllers/UserController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';


const routes = Router();

routes.get('/', UserController.findUsers);
routes.get('/:id', ensureAuthenticated, UserController.findUserById);
routes.post('/:id', UserController.create);
routes.put('/:id', ensureAuthenticated, UserController.update);
routes.put('/update-password/:id', ensureAuthenticated, ensureProfile, UserController.passwordUpdate);

export default routes;

