# DocExpress API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript) ![Express](https://img.shields.io/badge/Express-black?logo=express) ![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-lightgrey) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql) ![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker) ![Status](https://img.shields.io/badge/Status-Atualizado-green)

DocExpress é a **API backend** do projeto de gestão documental, construída em **Node.js + TypeScript** com **Express** e **TypeORM** (PostgreSQL). O projeto inclui **autenticação JWT**, **validação com Zod**, camadas bem definidas (Router → Middlewares → Controller → Service → Repository/Entities) e integração com _object storage_ (Supabase Storage por padrão).

---

## ✨ Observação sobre Storage

A documentação é **agnóstica ao provedor** de storage. As variáveis de ambiente seguem o prefixo `STORAGE_*` ou `SUPABASE_*`, permitindo migrar de plataforma sem alterar fluxos de código. No projeto atual, **Supabase Storage** está configurado como provedor de arquivos para _templates_ e _uploads_.

## ⚙️ Pré-requisitos

- Docker & Docker Compose (recomendado)
- Node.js 18+ (para execução local)
- Banco PostgreSQL acessível
- Credenciais do provedor de storage (ex.: Supabase)

---

## ⚙️ Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/projeto-integrador-comp/doc_express_BackEnd.git
cd doc_express_BackEnd
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

O arquivo `.env.example` está disponível na raiz do projeto.  
Crie seu arquivo `.env` com base nele:

```bash
cp .env.example .env
```

> 🔹 **Importante:** configure corretamente as credenciais do banco de dados e do Supabase antes de iniciar o servidor caso não vá executar localmente.

---

## 🐳 Execução com Docker

Para rodar o projeto completo (backend + banco de dados + seed automático do admin):

```bash
docker compose up -d --build
```

Ao rodar com Docker Compose, será automaticamente criado um **usuário administrador** no banco, com as credenciais:

```
email: admin@docexpress.com
senha: admin123
```

Esse seed é executado apenas quando o ambiente é inicializado localmente ou via Docker, garantindo que haja um usuário admin padrão para testes.

---

## 🧠 Execução Manual (sem Docker)

### 1. Rodar as migrações do TypeORM

```bash
npm run migration:run
```

### 2. Rodar o seed manualmente (para criar o admin)

```bash
npm run seed
```

### 3. Iniciar o servidor

```bash
npm run dev
```

## 🔧 Variáveis de Ambiente

Exemplo detectado de `.env.example`:

```env
# ========================
# Environment
# ========================
NODE_ENV=development

# ========================
# Application
# ========================
PORT=3000

# ========================
# Database (Postgres via TypeORM)
# ========================
# Format: postgres://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgres://myuser:mypass@db:5432/docexpress"

# ========================
# Authentication (JWT)
# ========================
SECRET_KEY="your_jwt_secret_here"

# ========================
# Supabase (Storage) --> Abilite somente se tiver acesso ao supabase e adicione as chaves necessárias
# ========================
# SUPABASE_URL=https://your-project-id.supabase.co
# SUPABASE_KEY=your-service-role-key
# SUPABASE_BUCKET_TEMPLATES=templates
# SUPABASE_BUCKET_UPLOADS=uploads
```

---

## 🗄️ Uploads Locais

Quando a aplicação é executada **em localhost** (sem Supabase configurado),  
os documentos enviados via upload são armazenados automaticamente na pasta:

```
uploads/templates
```

> A pasta é criada automaticamente caso não exista.

Em produção, os arquivos são armazenados no **Supabase Storage**, conforme configuração no `.env`.

---

## 🧱 Arquitetura

- **Routes**: `src/routes/*` mapeiam endpoints por recurso (`/users`, `/login`, `/profile`, `/documents`, `/templates`).
- **Middlewares**: autenticação (`verifyToken`), autorização (`verifyAdimn`, `verifyPermissions`), validação (`validateBody` com Zod), integridade (`verifyId`, `verifyUserExists`, `verifyOwnerDocument`).
- **Controllers**: orquestram requisições e chamadas de service.
- **Services**: regras de negócio, chamadas a repositórios e storage.
- **Repositories/Entities**: TypeORM com entidades `User` e `Document` (relacionamentos e _hooks_ para _hash_ de senha).
- **Schemas**: validações com Zod (`user.schema.ts`, `document.schema.ts`, `login.schema.ts`, `template.schema.ts`).
- **Storage**: `StorageService` integrado ao Supabase (upload/download, metadados).

## 📚 Fluxos de trabalho

1. **Autenticação**: `POST /login` → token JWT com `sub` e `admin`.
2. **Perfil**: `GET /profile` (token) retorna usuário e documentos.
3. **Usuários**: CRUD; listagem restrita a admin; _self-service_ para `GET/PATCH/DELETE /users/:id`.
4. **Documentos**: CRUD do usuário + **upload de anexo** (`POST /documents/:id/attachment`) enviando para o bucket.
5. **Templates**: download público (`GET /templates/:id/download`) e CRUD **apenas para admin**.

## 🗂️ Estrutura de Diretórios

```text
doc_express_BackEnd/
├── .env
├── .env.example
├── DER.png
├── Dockerfile
├── README.md
├── build.sh
├── dist/
│   ├── app.js
│   ├── config/
│   │   └── multer.config.js
│   ├── controllers/
│   │   ├── document.controller.js
│   │   ├── index.js
│   │   ├── login.controller.js
│   │   ├── profile.controller.js
│   │   ├── template.controller.js
│   │   └── user.controller.js
│   ├── data-source.js
│   ├── entities/
│   │   ├── document.entity.js
│   │   ├── template.entity.js
│   │   └── user.entity.js
│   ├── errors/
│   │   └── AppError.error.js
│   ├── interfaces/
│   │   ├── document.interface.js
│   │   ├── login.interface.js
│   │   ├── profile.interface.js
│   │   ├── template.interface.js
│   │   └── user.interface.js
│   ├── middlewares/
│   │   ├── handleAppError.middleware.js
│   │   ├── validateBody.middleware.js
│   │   ├── validateTokenProfile.middleware.js
│   │   ├── validatetoken.middleware.js
│   │   ├── verifyAdimin.middleware.js
│   │   ├── verifyEmail.middleware.js
│   │   ├── verifyId.middleware.js
│   │   ├── verifyOwnerDocument.middleware.js
│   │   ├── verifyPermissions.middleware.js
│   │   ├── verifyToken.middleware.js
│   │   └── verifyUserExists.middleware.js
│   ├── migrations/
│   │   ├── 1743031851927-initialMigration.js
│   │   ├── 1743095952042-documentRelationship.js
│   │   ├── 1743360350678-defaultNoteColumn.js
│   │   ├── 1744049938500-documentDelivered.js
│   │   ├── 1758239509471-CreateTemplatesTable.js
│   │   ├── 1758757501692-ChangeFilePathToFileUrl.js
│   │   └── 1759336383203-AddAttachmentFieldsToDocument.js
│   ├── repositories.js
│   ├── routes/
│   │   ├── document.route.js
│   │   ├── login.route.js
│   │   ├── profile.route.js
│   │   ├── template.route.js
│   │   └── user.route.js
│   ├── schemas/
│   │   ├── document.schema.js
│   │   ├── login.schema.js
│   │   ├── profile.schema.js
│   │   ├── template.schema.js
│   │   └── user.schema.js
│   ├── server.js
│   └── services/
│       ├── document.service.js
│       ├── login.service.js
│       ├── profile.service.js
│       ├── storage.service.js
│       ├── template.service.js
│       └── user.service.js
├── docker-compose.yml
├── docs/
│   ├── api_endpoints.md
│   └── old_README_v1.md
├── jest.config.ts
├── node_modules/
├── package-lock.json
├── package.json
├── src/
│   ├── app.ts
│   ├── config/
│   │   └── multer.config.ts
│   ├── controllers/
│   │   ├── document.controller.ts
│   │   ├── index.ts
│   │   ├── login.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── template.controller.ts
│   │   └── user.controller.ts
│   ├── data-source.ts
│   ├── entities/
│   │   ├── document.entity.ts
│   │   ├── template.entity.ts
│   │   └── user.entity.ts
│   ├── errors/
│   │   └── AppError.error.ts
│   ├── interfaces/
│   │   ├── document.interface.ts
│   │   ├── login.interface.ts
│   │   ├── profile.interface.ts
│   │   ├── template.interface.ts
│   │   └── user.interface.ts
│   ├── middlewares/
│   │   ├── handleAppError.middleware.ts
│   │   ├── validateBody.middleware.ts
│   │   ├── validateTokenProfile.middleware.ts
│   │   ├── validatetoken.middleware.ts
│   │   ├── verifyAdimin.middleware.ts
│   │   ├── verifyEmail.middleware.ts
│   │   ├── verifyId.middleware.ts
│   │   ├── verifyOwnerDocument.middleware.ts
│   │   ├── verifyPermissions.middleware.ts
│   │   ├── verifyToken.middleware.ts
│   │   └── verifyUserExists.middleware.ts
│   ├── migrations/
│   │   ├── 1743031851927-initialMigration.ts
│   │   ├── 1743095952042-documentRelationship.ts
│   │   ├── 1743360350678-defaultNoteColumn.ts
│   │   ├── 1744049938500-documentDelivered.ts
│   │   ├── 1758239509471-CreateTemplatesTable.ts
│   │   ├── 1758757501692-ChangeFilePathToFileUrl.ts
│   │   └── 1759336383203-AddAttachmentFieldsToDocument.ts
│   ├── repositories.ts
│   ├── routes/
│   │   ├── document.route.ts
│   │   ├── login.route.ts
│   │   ├── profile.route.ts
│   │   ├── template.route.ts
│   │   └── user.route.ts
│   ├── schemas/
│   │   ├── document.schema.ts
│   │   ├── login.schema.ts
│   │   ├── profile.schema.ts
│   │   ├── template.schema.ts
│   │   └── user.schema.ts
│   ├── server.ts
│   └── services/
│       ├── document.service.ts
│       ├── login.service.ts
│       ├── profile.service.ts
│       ├── storage.service.ts
│       ├── template.service.ts
│       └── user.service.ts
├── tests/
│   ├── document.attachment.test.ts
│   ├── fixtures/
│   │   └── sample.txt
│   ├── storage.test.ts
│   └── template.test.ts
├── tsconfig.json
```

## 📦 Scripts NPM

```json
{
  "dev": "tsnd --cls --rs --ignore-watch node_modules src/server.ts",
  "typeorm": "typeorm-ts-node-commonjs",
  "migration:create": "npm run typeorm -- migration:create",
  "migration:generate": "npm run typeorm -- migration:generate -d src/data-source.ts",
  "migration:run": "npm run typeorm -- migration:run -d src/data-source.ts",
  "migration:revert": "npm run typeorm -- migration:revert -d src/data-source.ts",
  "migration:show": "npm run typeorm -- migration:show -d src/data-source.ts",
  "schema:sync": "npm run typeorm -- schema:sync -d src/data-source.ts",
  "start": "npm run build && sleep 25 && npm run migration:run && node dist/server.js",
  "build": "tsc",
  "test": "jest --runInBand",
  "seed": "ts-node src/seeds/adminSeed.ts"
}
```

## 📑 Dependências

### Prod

| Package                 | Version   |
| ----------------------- | --------- |
| `@supabase/supabase-js` | `^2.57.4` |
| `bcryptjs`              | `^3.0.2`  |
| `cors`                  | `^2.8.5`  |
| `dotenv`                | `^16.4.7` |
| `express`               | `^4.21.2` |
| `express-async-errors`  | `^3.1.1`  |
| `jsonwebtoken`          | `^9.0.2`  |
| `multer`                | `^2.0.2`  |
| `pg`                    | `^8.14.1` |
| `reflect-metadata`      | `^0.2.2`  |
| `typeorm`               | `^0.3.21` |
| `zod`                   | `^3.24.2` |

### Dev

| Package               | Version   |
| --------------------- | --------- |
| `@types/bcryptjs`     | `^2.4.6`  |
| `@types/cors`         | `^2.8.17` |
| `@types/express`      | `^5.0.1`  |
| `@types/jest`         | `^30.0.0` |
| `@types/jsonwebtoken` | `^9.0.9`  |
| `@types/multer`       | `^2.0.0`  |
| `@types/supertest`    | `^6.0.3`  |
| `jest`                | `^30.2.0` |
| `sqlite3`             | `^5.1.7`  |
| `supertest`           | `^7.1.4`  |
| `ts-jest`             | `^29.4.4` |
| `ts-node-dev`         | `^2.0.0`  |
| `typescript`          | `^5.8.2`  |

## 🧪 Testes

Se houver testes configurados:

```bash
docker compose exec app npm test
# ou localmente
npm test
```

## 🗃️ Migrações

```bash
npm run migration:generate -- src/migrations/<name>
npm run migration:run -- -d src/data-source.ts
npm run migration:revert -- -d src/data-source.ts
```

## 📄 Documentação da API

Consulte [docs/api_endpoints.md](./doc_express_BackEnd/docs/api_endpoints.md) para exemplos completos por endpoint (inclui cURL e cenários de erro).

## 🐞 Troubleshooting rápido

- `ECONNREFUSED` em migrations: verifique serviço do DB e `DATABASE_URL`.
- Falhas em upload: checar permissões do bucket e variáveis `SUPABASE_*`.
- `401/403`: confirmar envio do header `Authorization: Bearer <token>` e privilégios.

---

## 🤝 Colaboradores

Este projeto foi desenvolvido como parte do **Projeto Integrador - UNIVESP**.

<div align="center">

### 👥 Nossa Equipe

<a href="https://github.com/julianohbl"><img src="https://github.com/julianohbl.png?size=100" width="100" height="100"></a>
<a href="https://github.com/Miguel-Lucio"><img src="https://github.com/Miguel-Lucio.png?size=100" width="100" height="100"></a>
<a href="https://github.com/felipecsr"><img src="https://github.com/felipecsr.png?size=100" width="100" height="100"></a>
<a href="https://github.com/Nu-li"><img src="https://github.com/Nu-li.png?size=100" width="100" height="100"></a>

<br>

<a href="https://github.com/Henrique-Kriguer"><img src="https://github.com/Henrique-Kriguer.png?size=100" width="100" height="100"></a>
<a href="https://github.com/rubenslaurindo"><img src="https://github.com/rubenslaurindo.png?size=100" width="100" height="100"></a>
<a href="https://github.com/abiratanl"><img src="https://github.com/abiratanl.png?size=100" width="100" height="100"></a>
<a href="https://github.com/23200967"><img src="https://github.com/23200967.png?size=100" width="100" height="100"></a>

</div>
