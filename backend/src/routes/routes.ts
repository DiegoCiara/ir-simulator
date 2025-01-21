import Router from 'express';
import AuthRoutes from './auth.routes';
import UserRoutes from './user.routes';
import DeclarationRoutes from './declaration.routes';

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const routes = Router();

const base = { 'API IR Simulator': 'Online' }

routes.get('/', (req, res) => {
  res.json(base);
});

const port = process.env.CLIENT_PORT

const swaggerOptions = {
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'API IR Simulator',
          version: '1.0.0',
          description: 'Documentação da API',
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./src/app/controllers/*.ts', './src/app/routes/*.ts'],
  };

const swaggerSpec = swaggerJsdoc(swaggerOptions);


routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
routes.use('/auth/', AuthRoutes);
routes.use('/user/', UserRoutes);
routes.use('/declaration/', DeclarationRoutes);

export default routes;
