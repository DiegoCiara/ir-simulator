import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/routes';
// import 'newrelic'

dotenv.config();

// Config
const app = express();

import './database';

app.use(express.json());
app.use(cors());
app.use(routes);

export default app;
