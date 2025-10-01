# API Endpoints — DocExpress

Este documento reúne a documentação dos endpoints da **DocExpress API (backend)**.

As chamadas cobrem operações REST típicas com respostas em JSON e autenticação via header `Authorization: Bearer <token>`.

---

## Formato de erro padrão

```json
{
  "status": "error",
  "message": "Descrição curta do erro",
  "errors": [
    { "field": "nomeDoCampo", "message": "mensagem de validação" }
  ]
}
```

---

## Autenticação

### POST /auth/login

Login de usuário — retorna JWT.

* Body (JSON):

```json
{ "email": "user@example.com", "password": "s3nh4" }
```

* Response 200:

```json
{ "token": "<jwt>", "user": { "id": 1, "email": "user@example.com", "name": "Fulano" } }
```

* Erros: 400 (campos faltando), 401 (credenciais inválidas)

### POST /auth/register

Criação de conta (quando aplicável).

* Body:

```json
{ "name": "Fulano", "email": "user@example.com", "password": "s3nh4" }
```

* Response: 201 com objeto usuário (sem senha) e token opcional.

### GET /auth/me

Retorna dados do usuário autenticado.

* Headers: `Authorization: Bearer <token>`
* Response 200: objeto `user`.

---

## Usuários (Users)

**Base path**: `/users`

### GET /users

Lista usuários.

* Query params suportados: `page`, `limit`, `q` (busca por nome/email), `sort` (ex: `createdAt:desc`).
* Response 200:

```json
{ "data": [ { "id":1, "name":"Fulano", "email":"x@x" } ], "meta": { "page":1, "limit":20, "total":123 } }
```

### GET /users/\:id

Obter usuário por id.

* Response 200: objeto usuário.
* Erros: 404 se não encontrado.

### POST /users

Criar usuário (admin).

* Body exemplo:

```json
{ "name":"Fulano", "email":"x@x.com", "password":"s3nh4", "role":"admin" }
```

* Response 201: objeto criado.

### PUT /users/\:id

Atualizar usuário.

* Body: campos permitidos (name, email, role, etc.).
* Response: 200 com usuário atualizado.

### DELETE /users/\:id

Remover usuário (soft delete, quando aplicável).

* Response: 204 (sem conteúdo) ou 200 com confirmação.

---

## Documentos (Documents)

**Base path**: `/documents`

Os documentos possuem metadados como: `submissionDate`, `note`, `delivered` (boolean), `ownerId`, `templateId`, e `files` (referência a storage).

### GET /documents

Listar documentos com filtros:

* Query params: `page`, `limit`, `status`, `ownerId`, `fromDate`, `toDate`, `q`.

### GET /documents/\:id

Detalhes do documento (inclui metadados e links de arquivo).

### POST /documents

Criar novo documento (JSON + referência de arquivo já no storage ou usando multipart/form-data):

* Exemplo body (JSON):

```json
{
  "title": "Entrega Contrato",
  "ownerId": 3,
  "submissionDate": "2025-09-01",
  "note": "Entrega via correio",
  "delivered": false,
  "templateId": 2
}
```

* Se upload direto for suportado via multipart, enviar `file` no form.

### PUT /documents/\:id

Atualizar metadados do documento.

### DELETE /documents/\:id

Remover documento (soft delete ou hard delete conforme política).

---

## Templates (repositório de modelos)

**Base path**: `/templates`

Os templates são armazenados em Supabase Storage (bucket `templates`), e a API mantém metadados na DB.

### GET /templates

Listar templates.

### POST /templates

Upload de template (multipart/form-data com arquivo e metadados).

* Campos: `name`, `description`, `file`.
* Fluxo: arquivo salvo no Supabase + registro no banco com `path`/`url`.

### GET /templates/\:id/download

Gera link para download (presigned URL) ou faz proxy do arquivo tornando o download transparente.

### DELETE /templates/\:id

Remover template e deletar arquivo no storage.

---

## Uploads genéricos (bucket `uploads`)

* Endpoint para upload direto: `POST /uploads` (multipart) — recebe arquivo, salva no bucket `uploads` e retorna `fileId`/`url`.
* Alternativa: `GET /uploads/presign` para obter URL presignada que o cliente usará para enviar o arquivo diretamente ao Supabase.

---

## Health & Admin

* GET /health (ou /status): retorna `200 OK` com informações básicas (uptime, versão, DB connection).
* GET /admin/migrations/status: status das migrations (quando implementado).

---

## Segurança

* JWT em `Authorization` Header.
* Roles: `user`, `admin` (exemplo). Endpoints de administração exigem role `admin`.

---

## Cabeçalhos e exemplos de cURL

Login (obter token):

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"s3nh4"}'
```

Usando token:

```bash
curl http://localhost:3000/documents -H "Authorization: Bearer <token>"
```

---

## Variáveis de ambiente importantes

Trecho adaptado do README: `PORT`, `DATABASE_URL`, `SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET_TEMPLATES`, `SUPABASE_BUCKET_UPLOADS`.

---


### 📎 Novo endpoint — Upload de anexo em Document (DEV-019 a DEV-023)

**POST /documents/:id/upload**

Permite anexar um arquivo a um documento existente, armazenando o arquivo no Supabase (bucket `uploads`) 
e salvando metadados (`fileUrl`, `fileName`, `mimeType`, `fileSize`, `fileUploadedAt`) na tabela `documents`.

* **Headers**:  
  `Authorization: Bearer <token>`  
  `Content-Type: multipart/form-data`

* **Body (form-data)**:
  - `file` (campo obrigatório — binário)
  - Metadados adicionais opcionais podem ser enviados (ex.: descrição)

* **Exemplo de requisição (cURL)**:

```bash
curl -X POST http://localhost:3000/documents/123/upload   -H "Authorization: Bearer <token>"   -F "file=@contrato.pdf"
```

* **Exemplo de resposta (200/201)**:

```json
{
  "id": "123",
  "title": "Entrega Contrato",
  "fileUrl": "https://supabase.mock/uploads/contrato.pdf",
  "fileName": "contrato.pdf",
  "mimeType": "application/pdf",
  "fileSize": 234567,
  "fileUploadedAt": "2025-10-01T18:30:00.000Z"
}
```

* **Erros**:
  - `400` se não houver arquivo.
  - `401` se usuário não autenticado ou não for dono do documento.
  - `404` se documento não existir.
