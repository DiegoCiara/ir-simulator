# Desafio Técnico: Simulador de Preenchimento de Imposto de Renda
Esta aplicação é um simulador de preenchimento de dados simples do imposto de renda, que se constitui em manter um histórico das declarações do imposto, assim como fazer a gestão das declarações, além de possuir um sistema de autenticação em 2 fatores com aplicativos de autenticação, como o Google Authenticator.

## Instruções de como rodar o projeto localmente(Geral)
Siga os passos abaixo na ordem para o melhor êxito ao executar o projeto. Dentro de cada repositório, há instruções para rodar cada parte do projeto. No backend, as instruções estão em `backend/README.md`, e no frontend, estão em `frontend/README.md`.

### 1. Rodando o back-end:
O back-end dessa aplicação é uma API RESTful desenvolvida em Node.js com Typescript, utilizando Express, PostgreSQL e TypeORM para gerenciamento de tabelas e conexões no banco de dados.

   - Acesse o diretório do projeto do backend: `cd backend`;
   - Crie as variáveis de ambiente, copiando o conteúdo do arquivo `.env.example` e cole no arquivo `.env` na raiz do projeto: `cp .env.example .env`;
   - Instale os pacotes da aplicação: `yarn` ou `yarn install`;
   - Suba o container da aplicação: `docker compose up -d`;
   - Rode as migrations para criar as tabelas com o TypeORM: `yarn typeorm migration:run`;
   - Sincronize as tabelas: `yarn typeorm schema:sync`;
   - Ao terminar esta configuração, a aplicação estará disponíve em `http://localhost:3333`.

O back-end atende todos os requisitos obrigatórios do projeto e um diferencial (Docker).

### 2. Rodando o Front-end:
O front-end foi desenvolvido utilizando React.js com Typescript, TailwindCSS, Shadcn UI para estilização de componentes e Material UI para criação de modais. O projeto também utiliza o React Router Dom para rotas e Axios para requisições de API.

   - Acesse o diretório do projeto do backend: `cd frontend`;
   - Crie as variáveis de ambiente, copiando o conteúdo do arquivo `.env.example` e cole no arquivo `.env` na raiz do projeto: `cp .env.example .env`;
   - Instale os pacotes: `yarn` ou `yarn install`;
   - Rode a aplicação com: `yarn dev`;
   - Ao terminar, a aplicação estará disponíve na porta padrão, em `http://localhost:5173`;

O front-end atende todos os requisitos obrigatórios do projeto.

# Informações do Desafio:
Objetivo: Desenvolver uma aplicação Full Stack que simule o preenchimento de declarações de imposto de renda, sendo 100% responsiva para dispositivos móveis. O sistema deve incluir funcionalidades de autenticação, preenchimento de dados, armazenamento em banco de dados e exibição de histórico de preenchimentos.

## Requisitos Técnicos
### 1. Back-end:
   - ✅ Utilizar Node.js com TypeScript.
   - Framework: NestJS (preferencial) ou Express ✅.
   - ✅ Banco de dados: PostgreSQL.

   Criar uma API RESTful para:
   - ✅ Gerenciamento de usuários (registro, login e autenticação 2FA).
   - ✅ Preenchimento de declarações de imposto de renda.
   - ✅ Exibição do histórico de preenchimentos por ano.
   - ✅ Implementar autenticação usando JWT.

### 2. Front-end:
   - ✅ Utilizar ReactJS com TypeScript.
   - ✅ Interface responsiva, adaptada para dispositivos móveis e desktops.

   Funcionalidades:
   - ✅ Tela de login e registro de usuários.
   - ✅ Tela para preenchimento de declarações (com validações).
   - ✅ Tela de histórico, listando as declarações por ano.

### 3. Banco de Dados:
   Modelos principais:
   - ✅ Usuário: Nome, e-mail, senha (hash).
   - ✅ Declaração: Ano, dados preenchidos (JSON ou campos específicos), data de criação, usuário associado.
   - ✅ Banco: PostgreSQL.

### 4. Design e UX/UI:
   - ✅ Interface web responsiva e acessível.
   - ✅ Uso de práticas de design responsivo e acessibilidade.
   - ✅ Estilização com Tailwind CSS.
   - ✅ Suporte a contêinerização com Docker.
   - ❌ Implementação de CI/CD simples (opcional).
   - ✅ Documentação da API utilizando Swagger ou equivalente.
   - ❌ Testes básicos (unitários e de integração).

## Funcionalidades Esperadas

### 1. Autenticação:
   - ✅ Registro e login de usuários com validação de dados.
   - ✅ Persistência da sessão utilizando JWT.

### 2. Preenchimento de Declarações:
   - ✅ Formulário para o preenchimento de dados de imposto de renda (dados fictícios ou reais simplificados).
   - ✅ Validação em tempo real dos campos obrigatórios.

### 3. Histórico de Preenchimentos:
   - ✅ Exibição de uma lista com os anos e datas de preenchimento de declarações anteriores.
   - ✅ Opção para visualizar ou editar declarações anteriores com status de não submetida (lembrar de criar status) e para as submetidas, apresentar opção de retificar, demonstrando diferenças.

### 4. Design Responsivo:
   - ✅ Total adaptação para dispositivos móveis e desktops.

## Entregáveis

### 1. Código-fonte no GitHub (ou outro repositório remoto):
   - ✅ Instruções claras de como rodar o projeto localmente.
   - ✅ Dockerfile e/ou docker-compose para execução simplificada (se implementado).
   - ✅ Scripts de inicialização do banco de dados e tabelas.

### 2. Documentação: 
   - ✅ Breve descrição do sistema.
   - Endpoints da API (caso Swagger não seja usado).
   - Instruções para rodar os testes.

## Critérios de Avaliação:
   - Qualidade do código e organização.
   - Conformidade com os requisitos.
   - Usabilidade e experiência do usuário.
   - Documentação clara e objetiva.
   - Implementação de boas práticas (responsividade, acessibilidade, segurança).

### Notas Adicionais:
Não é necessário implementar cálculos avançados do imposto de renda. Os dados podem ser fictícios ou baseados em campos genéricos.
A aplicação será avaliada não apenas pela funcionalidade, mas também pela estrutura do projeto, legibilidade do código e atenção aos detalhes.

Recursos extras (Docker, CI/CD, testes) são diferenciais, mas não obrigatórios.