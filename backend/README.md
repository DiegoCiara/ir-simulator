### Rodando o back-end:
O back-end dessa aplicação é uma API RESTful desenvolvida em Node.js com Typescript, utilizando Express, PostgreSQL e TypeORM para gerenciamento de tabelas e conexões no banco de dados.

   - Acesse o diretório do projeto do backend: `cd backend`;
   - Crie as variáveis de ambiente, copiando o conteúdo do arquivo `.env.example` e cole no arquivo `.env` na raiz do projeto: `cp .env.example .env`;
   - Instale os pacotes da aplicação: `yarn` ou `yarn install`;
   - Suba o container da aplicação: `docker compose up -d`;
   - Rode as migrations para criar as tabelas com o TypeORM: `yarn typeorm migration:run`;
   - Sincronize as tabelas: `yarn typeorm schema:scync`;
   - Ao terminar, a aplicação estará disponíve em `http://localhost:3333`.

O back-end atende todos os requisitos obrigatórios do projeto e um diferencial (Docker).