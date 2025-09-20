# DocExpress API

DocExpress é a API backend do projeto de gestão documental desenvolvida em **Node.js + TypeScript** com **Express**.  
O repositório contém a implementação do backend (V1 evoluindo para V2) com foco em boas práticas: `TypeORM`, testes automatizados, execução via Docker e integração com storage externo (Supabase).

---

## 📚 Contexto acadêmico (PI1 → PI2)
O projeto começou como um MVP durante o **Projeto Integrador I** e evoluiu no **Projeto Integrador II** com funcionalidades adicionais e refinamentos arquiteturais.  
Trata-se de uma **POC (prova de conceito)** criada no contexto do "PI2" da UNIVESP, com objetivo pedagógico e demonstrativo: aplicar práticas de desenvolvimento colaborativo, TDD e integração com serviços externos.

---

## 🛠️ Tecnologias principais
- Node.js (TypeScript)  
- Express  
- TypeORM  
- PostgreSQL  
- Supabase (Storage) — templates / uploads  
- Jest (tests)  
- Docker & Docker Compose

> Nota: A aplicação pode ser deployada em múltiplas plataformas (Render, Railway, Heroku, etc.). Caso o repositório referencie uma plataforma específica, isso é apenas um **exemplo** do ambiente onde a equipe rodou a POC.

---

## ⚙️ Pré-requisitos
- Docker & Docker Compose (para o fluxo recomendado)  
- Node.js (apenas se optar por rodar sem Docker)  
- Conta e projeto no Supabase (para storage e banco de dados)

---

## 🔧 Como rodar (recomendado: Docker)
1. Copie `.env.example` para `.env` e preencha as variáveis (veja seção **Variáveis de ambiente**).  
```bash
cp .env.example .env
```

2. Suba os containers:
```bash
docker compose up -d
```

3. Aplique as migrations (uma vez):
```bash
docker compose exec app npm run typeorm migration:run -- -d src/data-source
```

4. A API estará disponível em: `http://localhost:3000`

---

## ▶️ Rodar sem Docker (opcional)
```bash
npm install
cp .env.example .env
# ajuste .env conforme seu ambiente
npm run dev
```

---

## 🧩 Variáveis de ambiente (exemplo)
O projeto usa um arquivo `.env`. Exemplo de variáveis (veja `.env.example`):
```
PORT=3000
DATABASE_URL="postgres://myuser:mypass@db:5432/docexpress"
SECRET_KEY="random_secret_key"

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SUPABASE_BUCKET_TEMPLATES=templates
SUPABASE_BUCKET_UPLOADS=uploads
```

**Importante:** use a `service_role` key do Supabase no backend.

---

## 🧪 Testes
O desenvolvimento é orientado a testes (TDD). O projeto possui testes de integração (Jest) para os fluxos críticos.

Rodar testes:
```bash
docker compose exec app npm test
```

---

## ✨ Features principais (visão macro)
Estas são as capacidades do produto:
- Autenticação de usuários (JWT) e endpoint de perfil.  
- CRUD de usuários.  
- CRUD de documentos com metadados (submissionDate, note, delivered etc.).  
- Repositório de templates (upload e gerenciamento).  
- Integração com Supabase Storage para arquivos (buckets `templates` e `uploads`).  
- Ambiente dockerizado (app + banco) e migrações via TypeORM.  
- Testes automatizados para fluxos críticos.

---

## 📄 Documentação completa da API (endpoints)
A documentação detalhada com **exemplos de requests/responses** foi extraída do README original e está disponível em: [docs/api_endpoints.md](/doc_express_BackEnd/docs/api_endpoints.md)

