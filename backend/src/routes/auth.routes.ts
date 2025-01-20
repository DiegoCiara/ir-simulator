import AuthController from '@controllers/AuthController';
import Router from 'express';

const routes = Router();

routes.post('/authenticate', AuthController.authenticate);
routes.get('/2fa-code/:email', AuthController.get2FaQrCode);
routes.post('/verify-secret', AuthController.verifySecret);

export default routes;
