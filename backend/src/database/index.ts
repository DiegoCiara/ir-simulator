import { createConnection } from 'typeorm';
import config from '../../ormconfig'
import mocks from '../utils/mock';

async function connect() {
  await createConnection(config);
}

connect();