# Desafio Técnico: Simulador de Preenchimento de Imposto de Renda

Objetivo: Desenvolver uma aplicação Full Stack que simule o preenchimento de declarações de imposto de renda, sendo 100% responsiva para dispositivos móveis. O sistema deve incluir funcionalidades de autenticação, preenchimento de dados, armazenamento em banco de dados e exibição de histórico de preenchimentos.

Requisitos Técnicos
1 Back-end:
Utilizar Node.js com TypeScript.
- Framework: NestJS (preferencial) ou Express✅.
✅ Banco de dados: PostgreSQL.

Criar uma API RESTful para:
- Gerenciamento de usuários (registro, login e autenticação 2FA).
- Preenchimento de declarações de imposto de renda.
- Exibição do histórico de preenchimentos por ano.
- Implementar autenticação usando JWT.

2. Front-end:
   ✅ Utilizar ReactJS com TypeScript.
   ✅ Interface responsiva, adaptada para dispositivos móveis e desktops.

Funcionalidades:
✅ Tela de login e registro de usuários.
Tela para preenchimento de declarações (com validações).
Tela de histórico, listando as declarações por ano.

3. Banco de Dados:
   Modelos principais:
   ✅ Usuário: Nome, e-mail, senha (hash).
   ✅ Declaração: Ano, dados preenchidos (JSON ou campos específicos), data de criação, usuário associado.
   Banco: PostgreSQL.

4. Design e UX/UI:
   ✅ Interface web responsiva e acessível.
   ✅ Uso de práticas de design responsivo e acessibilidade.
   ✅ Estilização com Tailwind CSS.
   ✅ Suporte a contêinerização com Docker.
   Implementação de CI/CD simples (opcional).
   Documentação da API utilizando Swagger ou equivalente.
   Testes básicos (unitários e de integração).

Funcionalidades Esperadas

1. Autenticação:
   Registro e login de usuários com validação de dados.
   Persistência da sessão utilizando JWT.

2. Preenchimento de Declarações:
   Formulário para o preenchimento de dados de imposto de renda (dados fictícios ou reais simplificados).
   Validação em tempo real dos campos obrigatórios.

3. Histórico de Preenchimentos:
   Exibição de uma lista com os anos e datas de preenchimento de declarações anteriores.
   Opção para visualizar ou editar declarações anteriores com status de não submetida (lembrar de criar status) e para as submetidas, apresentar opção de retificar, demonstrando diferenças,.

4. Design Responsivo:
   ✅ Total adaptação para dispositivos móveis e desktops.

Entregáveis

1. Código-fonte no GitHub (ou outro repositório remoto):
   Instruções claras de como rodar o projeto localmente.
   Dockerfile e/ou docker-compose para execução simplificada (se implementado).
   Scripts de inicialização do banco de dados e tabelas.

2. Documentação: 
   Breve descrição do sistema.
   Endpoints da API (caso Swagger não seja usado).
   Instruções para rodar os testes.
   Critérios de Avaliação:
   - Qualidade do código e organização.
   - Conformidade com os requisitos.
   - Usabilidade e experiência do usuário.
   - Documentação clara e objetiva.
   - Implementação de boas práticas (responsividade, acessibilidade, segurança).

Notas Adicionais:
Não é necessário implementar cálculos avançados do imposto de renda. Os dados podem ser fictícios ou baseados em campos genéricos.
A aplicação será avaliada não apenas pela funcionalidade, mas também pela estrutura do projeto, legibilidade do código e atenção aos detalhes.

Recursos extras (Docker, CI/CD, testes) são diferenciais, mas não obrigatórios.

Boa sorte!
