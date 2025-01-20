import Router from 'express';
import DeclarationController from '@src/app/controllers/DeclarationController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';

const routes = Router();

routes.get('/', ensureAuthenticated, DeclarationController.findDeclarations);
routes.get('/:id', ensureAuthenticated, DeclarationController.findDeclarationById);
routes.post('/', ensureAuthenticated, DeclarationController.create);
routes.post('/rectified/:id', ensureAuthenticated, DeclarationController.rectified);
routes.put('/:id', ensureAuthenticated, DeclarationController.update);
routes.delete('/:id', ensureAuthenticated, DeclarationController.delete);

export default routes;

