import AuthController from '@controllers/AuthController';
import Router from 'express';

const routes = Router();

routes.post('/', AuthController.authenticate);
routes.get('/2fa/:email', AuthController.get2FaQrCode);
routes.post('/2fa/verify', AuthController.verifySecret);

export default routes;
