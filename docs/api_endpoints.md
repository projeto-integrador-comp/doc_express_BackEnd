# API Endpoints

Base URL (desenvolvimento): `http://localhost:3000`

Autenticação: **JWT Bearer** via header `Authorization: Bearer <token>`.


> Nota: os exemplos assumem execução local. Ajuste a URL conforme seu ambiente.

## Index
- [Login](#login)
- [Profile](#profile)
- [Users](#users)
- [Documents](#documents)
- [Templates](#templates)

## Login


### POST /login

Gera token JWT e retorna o usuário autenticado com seus documentos.

**Auth**: _Não requer_

**Headers**:
- `Content-Type: application/json`

**Body**
```json
{
  "email": "user@example.com",
  "password": "plaintext-or-hash"
}
```

**Responses**
- `200 OK`:
```json
{
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "Alice",
    "email": "user@example.com",
    "admin": false,
    "documents": [
      {
        "id": "uuid",
        "submissionDate": "2025-01-31",
        "documentName": "RG",
        "note": "",
        "delivered": false
      }
    ]
  }
}
```
- `401 Unauthorized`: credenciais inválidas
- `404 Not Found`: usuário inexistente (pode retornar 401 a depender da implementação)

**cURL**
```bash
curl -X POST "http://localhost:3000/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```


## Profile


### GET /profile

Retorna o usuário autenticado (sem token) incluindo documentos.

**Auth**: `Bearer <token>`

**Headers**:
- `Authorization: Bearer <token>`

**Responses**
- `200 OK`:
```json
{
  "user": {
    "id": "uuid",
    "name": "Alice",
    "email": "user@example.com",
    "admin": false,
    "documents": []
  }
}
```
- `401 Unauthorized`: token ausente ou inválido

**cURL**
```bash
curl "http://localhost:3000/profile" -H "Authorization: Bearer $TOKEN"
```


## Users


### POST /users

Cria novo usuário.

**Auth**: _Não requer_

**Headers**:
- `Content-Type: application/json`

**Body** (`userCreateSchema`)
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret",
  "admin": false
}
```

**Responses**
- `201 Created` (`userReturnSchema`):
```json
{
  "id": "uuid",
  "name": "Alice",
  "email": "alice@example.com",
  "admin": false
}
```
- `400 Bad Request`: violação de schema (Zod)
- `409 Conflict`: e-mail já cadastrado

**cURL**
```bash
curl -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```


### GET /users

Lista usuários (restrito a admin).

**Auth**: `Bearer <token>` (admin)

**Headers**:
- `Authorization: Bearer <token>`

**Responses**
- `200 OK` (`userListSchema`):
```json
[
  {"id":"uuid","name":"Alice","email":"alice@example.com","admin":false}
]
```
- `401 Unauthorized`
- `403 Forbidden`: permissão insuficiente

**cURL**
```bash
curl "http://localhost:3000/users" -H "Authorization: Bearer $ADMIN_TOKEN"
```


### GET /users/:id

Obtém um usuário por ID (self ou admin).

**Auth**: `Bearer <token>`

**Path Params**:
- `id` (uuid)

**Responses**
- `200 OK` (`userReturnSchema`)
- `401 Unauthorized`
- `403 Forbidden`: quando não é admin nem o próprio usuário
- `404 Not Found`

**cURL**
```bash
curl "http://localhost:3000/users/<uuid>" -H "Authorization: Bearer $TOKEN"
```


### PATCH /users/:id

Atualiza campos do usuário (self ou admin). Campo `admin` não é atualizável por este endpoint.

**Auth**: `Bearer <token>`

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Body** (`userUpdateSchema`, parcial)
```json
{
  "name": "Alice B.",
  "email": "alice.b@example.com",
  "password": "new-secret"
}
```

**Responses**
- `200 OK` (`userReturnSchema`)
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

**cURL**
```bash
curl -X PATCH "http://localhost:3000/users/<uuid>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice B."}'
```


### DELETE /users/:id

Remove o usuário (self ou admin).

**Auth**: `Bearer <token>`

**Responses**
- `204 No Content`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`

**cURL**
```bash
curl -X DELETE "http://localhost:3000/users/<uuid>" -H "Authorization: Bearer $TOKEN"
```


## Documents


### POST /documents

Cria documento para o usuário autenticado.

**Auth**: `Bearer <token>`

**Headers**:
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

**Body** (`documentCreateSchema`)
```json
{
  "submissionDate": "2025-01-31",
  "documentName": "RG",
  "note": "",
  "delivered": false
}
```

**Responses**
- `201 Created` (`documentReturnSchema`)
- `400 Bad Request`
- `401 Unauthorized`

**cURL**
```bash
curl -X POST "http://localhost:3000/documents" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"submissionDate":"2025-01-31","documentName":"RG"}'
```


### GET /documents

Lista documentos do usuário autenticado.

**Auth**: `Bearer <token>`

**Responses**
- `200 OK` (`documentListSchema`)
- `401 Unauthorized`

**cURL**
```bash
curl "http://localhost:3000/documents" -H "Authorization: Bearer $TOKEN"
```


### PATCH /documents/:id

Atualiza metadados do documento do usuário autenticado.

**Auth**: `Bearer <token>`

**Path Params**:
- `id` (uuid)

**Body** (`documentUpdateSchema`, parcial)
```json
{
  "documentName": "RG (frente e verso)",
  "delivered": true
}
```

**Responses**
- `200 OK` (`documentReturnSchema`)
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`

**cURL**
```bash
curl -X PATCH "http://localhost:3000/documents/<uuid>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"delivered":true}'
```


### DELETE /documents/:id

Remove documento do usuário autenticado.

**Auth**: `Bearer <token>`

**Responses**
- `204 No Content`
- `401 Unauthorized`
- `404 Not Found`

**cURL**
```bash
curl -X DELETE "http://localhost:3000/documents/<uuid>" -H "Authorization: Bearer $TOKEN"
```


### POST /documents/:id/attachment

Faz upload de anexo (arquivo) ao documento. Armazena em bucket (Supabase) e preenche `fileUrl`, `fileName`, `mimeType`, `fileSize`, `fileUploadedAt`.

**Auth**: `Bearer <token>`

**Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Path Params**:
- `id` (uuid)

**Form Data**
- `file`: arquivo a ser enviado

**Responses**
- `200 OK` (`documentReturnSchema` atualizado)
- `400 Bad Request`: ausência de arquivo
- `401 Unauthorized`
- `404 Not Found`: documento não pertence ao usuário

**cURL**
```bash
curl -X POST "http://localhost:3000/documents/<uuid>/attachment" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/caminho/para/arquivo.pdf"
```


## Templates


### GET /templates/:id/download

Download público do arquivo de template.

**Auth**: _Não requer_

**Path Params**:
- `id` (uuid)

**Responses**
- `200 OK`: binário do arquivo (headers `Content-Type` e `Content-Disposition`)
- `404 Not Found`: template não encontrado ou sem arquivo

**cURL**
```bash
curl -L "http://localhost:3000/templates/<uuid>/download" -o template.bin
```


### POST /templates

Cria template (admin) com upload de arquivo.

**Auth**: `Bearer <token>` (admin)

**Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data**
- `file`: arquivo a ser enviado (tipos permitidos: PDF, DOCX, XLSX)
- `name`: string (5-50)
- `description`: string (1-255)

**Responses**
- `201 Created` (`templateReturnSchema`)
- `400 Bad Request`: validação Zod (ex.: tipo de arquivo)
- `401 Unauthorized`
- `403 Forbidden`: não-admin

**cURL**
```bash
curl -X POST "http://localhost:3000/templates" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@/caminho/modelo.docx" \
  -F "name=Modelo de RG" \
  -F "description=Modelo oficial"
```


### GET /templates

Lista templates (admin).

**Auth**: `Bearer <token>` (admin)

**Responses**
- `200 OK`: array de templates
- `401 Unauthorized`
- `403 Forbidden`


### GET /templates/search

Busca templates por nome/descrição.

**Auth**: `Bearer <token>` (admin)

**Query Params**:
- `q`: termo de busca (string)

**Responses**
- `200 OK`: array de templates
- `401 Unauthorized`
- `403 Forbidden`

**cURL**
```bash
curl "http://localhost:3000/templates/search?q=RG" -H "Authorization: Bearer $ADMIN_TOKEN"
```


### GET /templates/:id

Retorna um template específico.

**Auth**: `Bearer <token>` (admin)

**Path Params**:
- `id` (uuid)

**Responses**
- `200 OK` (`templateReturnSchema`)
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`


### PATCH /templates/:id

Atualiza dados do template.

**Auth**: `Bearer <token>` (admin)

**Headers**:
- `Content-Type: application/json`

**Body** (`templateUpdateSchema`, parcial)
```json
{
  "name": "Novo Nome",
  "description": "Nova descrição"
}
```

**Responses**
- `200 OK` (`templateReturnSchema`)
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`


### DELETE /templates/:id

Remove template (soft-delete ou hard-delete conforme service).

**Auth**: `Bearer <token>` (admin)

**Responses**
- `204 No Content` _ou_ `200 OK` com recurso removido
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
