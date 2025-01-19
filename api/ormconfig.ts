import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv'

dotenv.config()
// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  port: Number(process.env.DB_PORT), // Ensure DB_PORT is defined in your environment
  host: process.env.DB_HOST, // Ensure DB_HOST is defined
  migrationsRun: true, // Run migrations on startup
  username: process.env.DB_USER, // Ensure DB_USER is defined
  password: process.env.DB_PASSWORD, // Ensure DB_PASSWORD is defined
  database: process.env.DB_NAME, // Ensure DB_NAME is defined
  entities: [ './src/app/entities/*'], // Adjust path based on your output
  migrations: ['./src/database/migrations/*'], // Adjust path based on your output
  cli: {
    entitiesDir:  './src/app/entities', // Path for CLI entities
    migrationsDir: './src/database/migrations', // Path for CLI migrations
  },
  extra: {
    options: '-c timezone=America/Sao_Paulo'
  }
};

export = config