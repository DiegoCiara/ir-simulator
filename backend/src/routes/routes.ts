import Router from 'express';
import AuthRoutes from './auth.routes';
import UserRoutes from './user.routes';
import DeclarationRoutes from './declaration.routes';

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const routes = Router();

const base = { 'API Simulador IR': 'Online' }

routes.get('/', (req, res) => {
  res.json(base);
});


const swaggerOptions = {
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'Minha API',
          version: '1.0.0',
          description: 'Documentação da API',
      },
      servers: [
        {
          url: 'http://localhost:3000', // Alterar conforme necessário
        },
      ],
    },
    apis: ['./src/app/controllers/*.ts', './src/app/routes/*.ts'], // Caminho dos arquivos
  };
  
const swaggerSpec = swaggerJsdoc(swaggerOptions);


routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
routes.use('/auth', AuthRoutes);
routes.use('/user/', UserRoutes);
routes.use('/declaration/', DeclarationRoutes);

export default routes;
