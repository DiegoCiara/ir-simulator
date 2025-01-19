import AuthController from '@controllers/AuthController';
import Router from 'express';

const routes = Router();

routes.post('/authenticate', AuthController.authenticate);

export default routes;
