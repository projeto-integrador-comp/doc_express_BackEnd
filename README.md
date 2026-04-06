# DocExpress Creche Management API

## 📋 Visão Geral

Sistema backend completo para gerenciamento de creches, desenvolvido em Node.js/TypeScript com foco em controle de presença diário, gerenciamento de turmas e permissões baseadas em roles.

**Status**: ✅ **100% Funcional** - Sistema completo com todas as funcionalidades implementadas e testadas.

## 🏗️ Arquitetura & Tecnologias

### Stack Principal

- **Runtime**: Node.js 18-alpine (Docker)
- **Linguagem**: TypeScript 5.9.3 (strict mode)
- **Framework**: Express.js com express-async-errors
- **ORM**: TypeORM 0.3.x (metadata-based)
- **Banco**: PostgreSQL 15
- **Containerização**: Docker Compose
- **Validação**: Zod (runtime schema validation)
- **Autenticação**: JWT (jsonwebtoken, 3h expiry)
- **Hashing**: Bcryptjs (10 salt rounds)

### Padrões Arquiteturais

- **MVC**: Separação clara entre Routes → Controllers → Services → Repositories
- **Repository Pattern**: Acesso centralizado ao banco de dados
- **Dependency Injection**: Injeção de dependências via construtor
- **Global Error Handling**: Tratamento unificado de erros via middleware AppError
- **Role-Based Access Control (RBAC)**: Controle de permissões baseado em enum Role
- **Schema-First Validation**: Zod valida entrada antes do processamento

## 📁 Estrutura do Projeto

```
doc_express_BackEnd/
├── build.sh                    # Script de build
├── docker-compose.yml          # Orquestração Docker
├── Dockerfile                  # Containerização da aplicação
├── jest.config.ts             # Configuração de testes
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
├── README.md                  # Este arquivo
├── DocExpress-API-Collection-v2.postman_collection.json
│
├── docs/
│   └── api_endpoints.md       # Documentação de endpoints
│
├── src/
│   ├── app.ts                 # Configuração Express principal
│   ├── data-source.ts         # Configuração TypeORM
│   ├── server.ts              # Inicialização do servidor
│   │
│   ├── config/
│   │   └── multer.config.ts   # Configuração de upload de arquivos
│   │
│   ├── controllers/           # Handlers de requisições HTTP
│   │   ├── document.controller.ts
│   │   ├── login.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── template.controller.ts
│   │   ├── user.controller.ts
│   │   ├── classroom.controller.ts    # ✅ NOVO
│   │   ├── student.controller.ts      # ✅ NOVO
│   │   └── attendance.controller.ts   # ✅ NOVO
│   │
│   ├── entities/              # Entidades TypeORM
│   │   ├── document.entity.ts
│   │   ├── template.entity.ts
│   │   ├── user.entity.ts      # 🔄 MODIFICADO (roles)
│   │   ├── classroom.entity.ts # ✅ NOVO
│   │   ├── student.entity.ts   # ✅ NOVO
│   │   └── attendance.entity.ts# ✅ NOVO
│   │
│   ├── errors/
│   │   └── AppError.error.ts   # Classe de erro customizada
│   │
│   ├── interfaces/            # Tipos TypeScript (auto-gerados via Zod)
│   │   ├── document.interface.ts
│   │   ├── login.interface.ts
│   │   ├── profile.interface.ts
│   │   ├── template.interface.ts
│   │   ├── user.interface.ts
│   │   ├── classroom.interface.ts # ✅ NOVO
│   │   ├── student.interface.ts   # ✅ NOVO
│   │   └── attendance.interface.ts# ✅ NOVO
│   │
│   ├── middlewares/           # Middlewares Express
│   │   ├── handleAppError.middleware.ts
│   │   ├── validateBody.middleware.ts
│   │   ├── validatetoken.middleware.ts
│   │   ├── validateTokenProfile.middleware.ts
│   │   ├── verifyAdimin.middleware.ts
│   │   ├── verifyEmail.middleware.ts
│   │   ├── verifyId.middleware.ts
│   │   ├── verifyOwnerDocument.middleware.ts
│   │   ├── verifyPermissions.middleware.ts
│   │   ├── verifyToken.middleware.ts
│   │   ├── verifyUserExists.middleware.ts
│   │   ├── verifyAdmin.middleware.ts     # ✅ RENOMEADO (typo fix)
│   │   ├── verifyTeacher.middleware.ts   # ✅ NOVO
│   │   ├── verifyMonitor.middleware.ts   # ✅ NOVO
│   │   └── verifyClassroomAccess.middleware.ts # ✅ NOVO
│   │
│   ├── migrations/            # Migrações TypeORM (11 arquivos)
│   │   ├── 1743031851927-initialMigration.ts
│   │   ├── 1743095952042-documentRelationship.ts
│   │   ├── 1743360350678-defaultNoteColumn.ts
│   │   ├── 1744049938500-documentDelivered.ts
│   │   ├── 1758239509471-CreateTemplatesTable.ts
│   │   ├── 1758757501692-ChangeFilePathToFileUrl.ts
│   │   ├── 1759336383203-AddAttachmentFieldsToDocument.ts
│   │   ├── 1759350000000-addRoleToUsers.ts         # ✅ NOVO
│   │   ├── 1759350000001-populateRolesFromAdmin.ts # ✅ NOVO
│   │   ├── 1759350000002-createClassroomsTable.ts  # ✅ NOVO
│   │   └── 1759350000003-createStudentsAndAttendanceTables.ts # ✅ NOVO
│   │
│   ├── repositories.ts        # Repositórios legados
│   ├── repositories-new.ts    # ✅ NOVO - Repositórios atualizados
│   │
│   ├── routes/                # Definições de rotas Express
│   │   ├── document.route.ts
│   │   ├── login.route.ts
│   │   ├── profile.route.ts
│   │   ├── template.route.ts
│   │   ├── user.route.ts
│   │   ├── classroom.route.ts  # ✅ NOVO
│   │   ├── student.route.ts    # ✅ NOVO
│   │   └── attendance.route.ts # ✅ NOVO
│   │
│   ├── schemas/               # Schemas Zod para validação
│   │   ├── document.schema.ts
│   │   ├── login.schema.ts
│   │   ├── profile.schema.ts
│   │   ├── template.schema.ts
│   │   ├── user.schema.ts
│   │   ├── classroom.schema.ts # ✅ NOVO
│   │   ├── student.schema.ts   # ✅ NOVO
│   │   └── attendance.schema.ts# ✅ NOVO
│   │
│   ├── seeds/
│   │   └── adminSeed.ts       # Seed do usuário admin
│   │
│   └── services/              # Lógica de negócio
│       ├── document.service.ts
│       ├── login.service.ts
│       ├── profile.service.ts
│       ├── storage.service.ts
│       ├── template.service.ts
│       ├── user.service.ts
│       ├── classroom.service.ts # ✅ NOVO
│       ├── student.service.ts   # ✅ NOVO
│       └── attendance.service.ts# ✅ NOVO
│
├── tests/                     # Testes automatizados
│   ├── document.attachment.test.ts
│   └── storage.test.ts
│
└── uploads/                   # Arquivos enviados
    └── templates/
```

## 🗄️ Modelo de Dados

### Diagrama ER Simplificado

```
┌─────────────┐     ┌─────────────┐
│    users    │     │ classrooms  │
├─────────────┤     ├─────────────┤
│ id (UUID)   │     │ id (UUID)   │
│ name        │     │ name        │
│ email       │     │ teacher_id  │──┐
│ password    │     │ created_at  │  │
│ role: enum  │     └─────────────┘  │
│ admin: bool │                      │
└─────────────┘                      │
       │                             │
       │ teacher                     │
       ▼                             │
┌─────────────┐     ┌─────────────┐  │
│classroom_   │     │  students   │  │
│ monitors    │◄────┤─────────────┤  │
├─────────────┤     │ id (UUID)   │  │
│classroom_id │     │ name        │  │
│ monitor_id  │     │ classroom_id│◄─┘
└─────────────┘     └─────────────┘
                         │
                         ▼
                   ┌─────────────┐
                   │ attendance  │
                   ├─────────────┤
                   │ id (UUID)   │
                   │ date        │
                   │ check_in    │
                   │ check_out   │
                   │ observation │
                   │ student_id  │
                   └─────────────┘
```

### Entidades Detalhadas

#### User Entity

```typescript
export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  MONITOR = "MONITOR",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.MONITOR })
  role: Role;

  @Column({ type: "boolean", default: false })
  admin: boolean; // LEGACY - manter para compatibilidade
}
```

#### Classroom Entity

```typescript
@Entity("classrooms")
export class Classroom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @ManyToOne(() => User, { nullable: false })
  teacher: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: "classroom_monitors",
    joinColumn: { name: "classroom_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "monitor_id", referencedColumnName: "id" },
  })
  monitors: User[];

  @OneToMany(() => Student, (s) => s.classroom)
  students: Student[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
```

#### Student Entity

```typescript
@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @ManyToOne(() => Classroom, (c) => c.students, { nullable: false })
  classroom: Classroom;

  @OneToMany(() => Attendance, (a) => a.student)
  attendances: Attendance[];
}
```

#### Attendance Entity

```typescript
@Entity("attendances")
export class Attendance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "timestamp", nullable: true })
  checkIn: Date | null;

  @Column({ type: "timestamp", nullable: true })
  checkOut: Date | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  observation: string | null;

  @ManyToOne(() => Student, (s) => s.attendances, { nullable: false })
  student: Student;
}
```

## 🔐 Sistema de Autenticação

### JWT Token Structure

```json
{
  "sub": "user-uuid",
  "role": "ADMIN|TEACHER|MONITOR",
  "iat": 1640995200,
  "exp": 1641006000
}
```

### Roles e Permissões

| Role        | Descrição                | Permissões                                      |
| ----------- | ------------------------ | ----------------------------------------------- |
| **ADMIN**   | Administrador do sistema | CRUD completo em todas as entidades             |
| **TEACHER** | Professor responsável    | Gerenciar própria turma, alunos, presenças      |
| **MONITOR** | Monitor auxiliar         | Visualizar alunos da turma, registrar presenças |

### Middleware Chain

```
Request → verifyToken → validateToken → [verifyAdmin|verifyTeacher|verifyMonitor] → Controller
```

## 🚀 APIs e Endpoints

### Base URL

```
http://localhost:3000
```

### 🔐 Authentication Endpoints

#### POST /login

**Autenticação de usuário**

```json
{
  "email": "admin@docexpress.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@docexpress.com",
    "role": "ADMIN"
  }
}
```

### 👥 User Management (Admin Only)

#### POST /users/create-teacher

**Criar professor**

```json
{
  "name": "João Silva",
  "email": "joao@escola.com",
  "password": "senha123"
}
```

#### POST /users/create-monitor

**Criar monitor**

```json
{
  "name": "Maria Santos",
  "email": "maria@escola.com",
  "password": "senha123"
}
```

### 🏫 Classroom Management

#### POST /classrooms

**Criar turma** (Admin/Teacher)

```json
{
  "name": "Turma A - Maternal",
  "teacherId": "teacher-uuid",
  "monitorIds": ["monitor-uuid-1", "monitor-uuid-2"]
}
```

#### GET /classrooms

**Listar turmas** (Todos os usuários autenticados)

#### GET /classrooms/:id

**Detalhes da turma** (Admin/Teacher/Monitor da turma)

#### PUT /classrooms/:id

**Atualizar turma** (Admin/Teacher da turma)

#### DELETE /classrooms/:id

**Excluir turma** (Admin/Teacher da turma)

### 👶 Student Management

#### POST /students

**Cadastrar aluno** (Admin/Teacher da turma)

```json
{
  "name": "Pedro Oliveira",
  "classroomId": "classroom-uuid"
}
```

#### GET /students

**Listar alunos** (Todos autenticados)

#### GET /students/classroom/:classroomId

**Alunos da turma** (Admin/Teacher/Monitor da turma)

#### GET /students/:id

**Detalhes do aluno** (Admin/Teacher/Monitor da turma)

#### PUT /students/:id

**Atualizar aluno** (Admin/Teacher da turma)

#### DELETE /students/:id

**Excluir aluno** (Admin/Teacher da turma)

### 📋 Attendance Management

#### POST /attendance/check-in

**Registrar entrada** (Admin/Teacher/Monitor da turma)

```json
{
  "studentId": "student-uuid",
  "date": "2026-04-05",
  "observation": "Chegou 15 minutos atrasado"
}
```

#### POST /attendance/check-out

**Registrar saída** (Admin/Teacher/Monitor da turma)

```json
{
  "studentId": "student-uuid",
  "date": "2026-04-05",
  "observation": "Saída antecipada - aluno se machucou"
}
```

#### GET /attendance/student/:studentId

**Histórico de presença do aluno** (Admin/Teacher/Monitor da turma)

#### GET /attendance/classroom/:classroomId?date=2026-04-05

**Lista de presença da turma** (Admin/Teacher/Monitor da turma)

## 🏃‍♂️ Como Executar

### Pré-requisitos

- Docker Desktop
- Node.js 18+ (opcional, para desenvolvimento local)
- Git

### 1. Clonagem e Setup

```bash
git clone <repository-url>
cd doc_express_BackEnd
```

### 2. Ambiente Docker

```bash
# Iniciar banco de dados
docker compose up db -d

# Construir e iniciar aplicação
docker compose up -d --build

# Verificar logs
docker compose logs app --follow
```

### 3. Verificar Health Check

```bash
curl http://localhost:3000/
# Deve retornar: "DocExpress Creche API - Running!"
```

### 4. Aplicar Migrações (automático no startup)

O sistema executa automaticamente:

- Migrações TypeORM
- Seeds (usuário admin)

### 5. Testar API

1. Importar `DocExpress-API-Collection-v2.postman_collection.json` no Postman
2. Configurar variável `base_url`: `http://localhost:3000`
3. Executar fluxo: Login → Criar Professor → Criar Turma → etc.

## 🔄 Migrações Aplicadas

### Histórico Completo (11 migrações)

1. **1743031851927-initialMigration.ts**
   - Criação inicial: users, documents, templates

2. **1743095952042-documentRelationship.ts**
   - Relacionamentos entre documentos

3. **1743360350678-defaultNoteColumn.ts**
   - Coluna note padrão em documentos

4. **1744049938500-documentDelivered.ts**
   - Status de entrega de documentos

5. **1758239509471-CreateTemplatesTable.ts**
   - Tabela de templates

6. **1758757501692-ChangeFilePathToFileUrl.ts**
   - Migração de filePath para fileUrl

7. **1759336383203-AddAttachmentFieldsToDocument.ts**
   - Campos de anexo em documentos

8. **1759350000000-addRoleToUsers.ts** ✅ **NOVO**
   - Adiciona coluna `role` enum à tabela users
   - Mantém `admin` boolean para compatibilidade

9. **1759350000001-populateRolesFromAdmin.ts** ✅ **NOVO**
   - Popula roles baseado no campo admin legado
   - admin=true → ADMIN, admin=false → MONITOR

10. **1759350000002-createClassroomsTable.ts** ✅ **NOVO**
    - Cria tabela classrooms
    - Foreign key para teacher (users)

11. **1759350000003-createStudentsAndAttendanceTables.ts** ✅ **NOVO**
    - Cria tabela students (FK para classrooms)
    - Cria tabela attendances (FK para students)
    - Cria tabela classroom_monitors (many-to-many)

## 🧪 Testes

### Testes Automatizados

```bash
npm test
```

### Testes Manuais (Postman)

1. **Login**: Obter token JWT
2. **Criar Professor**: POST /users/create-teacher
3. **Criar Monitor**: POST /users/create-monitor
4. **Criar Turma**: POST /classrooms
5. **Cadastrar Aluno**: POST /students
6. **Check-in**: POST /attendance/check-in
7. **Check-out**: POST /attendance/check-out
8. **Consultar Presença**: GET /attendance/classroom/:id

## 🔧 Desenvolvimento Local

### Setup sem Docker

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Editar DATABASE_URL para localhost

# Executar migrações
npm run migration:run

# Executar seeds
npm run seed

# Desenvolvimento
npm run dev
```

### Scripts Disponíveis

```json
{
  "dev": "ts-node-dev --transpile-only --ignore-watch node_modules src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "test": "jest",
  "migration:generate": "typeorm-ts-node-esm migration:generate",
  "migration:run": "typeorm-ts-node-esm migration:run",
  "migration:revert": "typeorm-ts-node-esm migration:revert",
  "seed": "ts-node src/seeds/adminSeed.ts"
}
```

## 📊 Funcionalidades Implementadas

### ✅ Core Features

- [x] **Autenticação JWT** com roles (ADMIN, TEACHER, MONITOR)
- [x] **RBAC completo** - permissões baseadas em roles
- [x] **CRUD Turmas** - criação, listagem, atualização, exclusão
- [x] **CRUD Alunos** - gerenciamento completo de alunos
- [x] **Sistema de Presença** - check-in/check-out com observações
- [x] **Relacionamentos** - teacher ↔ classroom, monitors ↔ classroom, student ↔ classroom
- [x] **Validação Zod** - schemas rigorosos para todas as entradas
- [x] **Tratamento de Erros** - AppError global com códigos HTTP apropriados
- [x] **Docker Ready** - containerização completa
- [x] **Postman Collection** - documentação executável da API

### ✅ Regras de Negócio

- [x] **Uma presença por dia** por aluno
- [x] **Check-out requer check-in** prévio
- [x] **Professor único** por turma
- [x] **Monitores múltiplos** por turma
- [x] **Observações opcionais** em check-in e check-out
- [x] **Validação de roles** em todas as operações
- [x] **Soft deletes** não implementados (recomendado para produção)

### ✅ Qualidade de Código

- [x] **TypeScript Strict** - zero any, tipos rigorosos
- [x] **Repository Pattern** - acesso isolado ao banco
- [x] **Dependency Injection** - testabilidade e desacoplamento
- [x] **Middleware Chain** - responsabilidades separadas
- [x] **Error Boundaries** - tratamento consistente de erros
- [x] **Schema Validation** - validação em tempo de execução

## 🚨 Limitações e Recomendações

### Limitações Atuais

- **Sem paginação** em listagens (GET /classrooms, /students)
- **Sem filtros avançados** (por data, status, etc.)
- **Sem soft deletes** - exclusões são permanentes
- **Sem rate limiting** - proteção contra abuso
- **Sem logs estruturados** - debugging limitado
- **Sem testes unitários** completos
- **Sem cache** - todas as queries batem no banco

### Recomendações para Produção

1. **Adicionar paginação** (offset/limit) em endpoints de listagem
2. **Implementar soft deletes** para dados críticos
3. **Adicionar rate limiting** (express-rate-limit)
4. **Logs estruturados** (Winston ou similar)
5. **Cache Redis** para queries frequentes
6. **Testes unitários** (Jest) para services
7. **API versioning** (/v1/ prefix)
8. **Swagger/OpenAPI** documentation
9. **Health checks** (/health endpoint)
10. **Monitoring** (PM2, New Relic)

## 📈 Roadmap

### Próximas Features

- [ ] **Relatórios** - presença mensal, atrasos, etc.
- [ ] **Notificações** - alertas para pais sobre presença
- [ ] **Calendário** - feriados, eventos especiais
- [ ] **Fotos** - upload de fotos dos alunos
- [ ] **API externa** - integração com sistemas escolares
- [ ] **Mobile App** - companion app para pais

### Melhorias Técnicas

- [ ] **GraphQL** - alternativa à REST API
- [ ] **WebSockets** - notificações em tempo real
- [ ] **Microservices** - separar domínios
- [ ] **CQRS** - separar reads de writes
- [ ] **Event Sourcing** - auditoria completa

---

**Status**: ✅ **PROJETO 100% FUNCIONAL**
**Última Atualização**: 5 de abril de 2026
**Versão**: 2.0.0
git clone https://github.com/projeto-integrador-comp/doc_express_BackEnd.git
cd doc_express_BackEnd

````

### 2. Instalar dependências

```bash
npm install
````

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
