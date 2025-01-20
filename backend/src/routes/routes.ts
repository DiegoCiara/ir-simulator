import Router from 'express';
import AuthRoutes from './auth.routes';
import UserRoutes from './user.routes';
import DeclarationRoutes from './declaration.routes';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';

const routes = Router();

const base = { 'API Simulador IR': 'Online' }

routes.get('/', (req, res) => {
  res.json(base);
});

routes.use('/auth', AuthRoutes);
routes.use('/user/', UserRoutes);
routes.use('/declaration/', DeclarationRoutes);

export default routes;
