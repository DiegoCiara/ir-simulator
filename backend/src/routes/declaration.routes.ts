import Router from 'express';
import DeclarationController from '@src/app/controllers/DeclarationController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';


const routes = Router();

routes.get('/', ensureAuthenticated, DeclarationController.findDeclarations);
routes.get('/:id', ensureAuthenticated, DeclarationController.findDeclarationById);
routes.post('/', ensureAuthenticated, DeclarationController.create);
routes.post('/retificate/', ensureAuthenticated, DeclarationController.retificate);
routes.put('/:id', ensureAuthenticated, DeclarationController.update);
routes.delete('/:id', ensureAuthenticated, DeclarationController.delete);

export default routes;

