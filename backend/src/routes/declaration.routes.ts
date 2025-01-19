import Router from 'express';
import DeclarationController from '@src/app/controllers/DeclarationController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';


const routes = Router();

routes.get('/', DeclarationController.findDeclarations);
routes.get('/:id', DeclarationController.findDeclarationById);
routes.post('/', DeclarationController.create);
routes.put('/:id', DeclarationController.update);
routes.delete('/:id', DeclarationController.delete);

export default routes;

