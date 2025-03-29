<h1 align = center>PI_grupo19_API</h1>

API Feita com Node.js (Express), onde usuários podem gerenciar a entrega de documentos.

<h2>Configuração do ambiente</h1>

1. Dentro do diretório, abra o terminal e instale as dependências necessárias para rodar a aplicação localmente:

```shell
npm install
```

2. Crie o arquivo .env com as variáveis declaradas no arquivo .env.example

```shell
# Exemplo de como preencher o .env
PORT=3000
DATABASE_URL="postgres://User:1234@localhost:5432/BancoDeDados"
SECRET_KEY="chaveAleatoria"
```

3. Rode as migrações do banco de dados vinculado utilizando o seguinte comando no terminal:

```shell
npm run typeorm migration:run -- -d src/data-source
```

4. Para Rodar a aplicação utilize o comando abaixo:

```shell
npm run dev
```

Após Rodar a aplicalção a API poderá ser acessada localmente a partir da URL:
http://localhost:3000

<h1 align = center>Endpoints da aplicação</h1>

<h2>Rota de Login</h2>

| Método | Endpoint | Responsabilidade |
| ------ | -------- | ---------------- |
| POST   | /login   | Login de usuário |

<h3>POST /login</h3>
Rota de login de usuário

| Request                |
| ---------------------- |
| Body: application/json |

```json
{
  "password": "1234",
  "email": "usuario@mail.com"
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 200 OK         |

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzQzMjY5MDg2LCJleHAiOjE3NDMyNzk4ODYsInN1YiI6ImIwOWY4OWQ5LWRmNDctNGVhZi1iM2I1LTAxZTRkY2Q0ZjUxOCJ9.el-3lQkezRutzFudIq6CdVEb60AY3jIGQt48bgK3NwM",
  "user": {
    "id": "b09f89d9-df47-4eaf-b3b5-01e4dcd4f518",
    "name": "Usuário",
    "email": "usuario@mail.com",
    "admin": true,
    "documents": []
  }
}
```

| Response                |
| ----------------------- |
| Body: application/json  |
| Status: 400 BAD REQUEST |

```json
{
  "message": {
    "email": ["Required"],
    "password": ["Required"]
  }
}
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status: 401 UNAUTHORIZED |

```json
{
  "message": "Invalid credentials."
}
```

<h2>Rota de Perfil</h2>

| Método | Endpoint | Responsabilidade  |
| ------ | -------- | ----------------- |
| POST   | /profile | Perfil de usuário |

<h3>GET /profile</h3>
Rota de informações do usuário
(Rota para usuários autenticados)

| Request            |
| ------------------ |
| Body: No content   |
| Auth: Bearer Token |

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 200 OK         |

```json
{
  "user": {
    "id": "b09f89d9-df47-4eaf-b3b5-01e4dcd4f518",
    "name": "Usuário",
    "email": "usuario@mail.com",
    "admin": true,
    "documents": []
  }
}
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status: 401 UNAUTHORIZED |

```json
{
  "message": "Missing bearer token."
}
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status: 401 UNAUTHORIZED |

```json
{
  "message": "invalid signature"
}
```

<h2>Rotas de Usuários</h2>

| Método | Endpoint   | Responsabilidade                     |
| ------ | ---------- | ------------------------------------ |
| POST   | /users     | Cadastro de usuário                  |
| GET    | /users     | Listagem de usuários                 |
| GET    | /users/:id | Listagem de usuário passando o id    |
| PATCH  | /users/:id | Atualização de usuário passando o id |
| DELETE | /users/:id | Deleção de usuário passando o id     |

<h3>POST /users</h3>
Rota de criação de usuário

| Request                |
| ---------------------- |
| Body: application/json |

```json
{
  "name": "Administrador",
  "password": "1234",
  "email": "admin@mail.com",
  "admin": true

  //   o envio de "admin" não é obrigatório (default: false).
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 201 CREATED    |

```json
{
  "id": "4027f9da-b32c-42ad-9faf-842483156e69",
  "name": "Administrador",
  "email": "admin@mail.com",
  "admin": true
}
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status : 400 BAD REQUEST |

```json
{
  "message": {
    "name": ["Required"],
    "email": ["Required"],
    "password": ["Required"]
  }
}
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status : 400 BAD REQUEST |

```json
{
  "message": "Email already exists."
}
```

<h3>GET /users</h3>
Rota de listagem de usuários
(Apenas Usuários Admin podem acessar.)

| Request            |
| ------------------ |
| Body: No content   |
| Auth: Bearer Token |

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 200 OK         |

```json
[
  {
    "id": "efeb1a83-afb0-4ab5-81f6-1ef2ece44532",
    "name": "Administrador",
    "email": "admin@mail.com",
    "admin": true
  },
  {
    "id": "b09f89d9-df47-4eaf-b3b5-01e4dcd4f518",
    "name": "Usuário",
    "email": "usuario@mail.com",
    "admin": false
  },
  {
    "id": "210832c2-1be7-4ba2-9293-d27a17d1370d",
    "name": "Usuário 2",
    "email": "usuario2@mail.com",
    "admin": false
  }
]
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status: 401 UNAUTHORIZED |

```json
{
  "message": "Missing bearer token."
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 403 FORBIDDEN  |

```json
{
  // Rsposta de usuário não admin
  "message": "Insufficient permission."
}
```

<h3>GET /users/:id</h3>
Rota de listagem de usuário pelo id
(Apenas o usuário proprietário da conta e usuários admin podem acessar.)

| Request            |
| ------------------ |
| Body: No content   |
| Auth: Bearer Token |

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 200 OK         |

```json
{
  "id": "b09f89d9-df47-4eaf-b3b5-01e4dcd4f518",
  "name": "Usuário",
  "email": "usuario@mail.com",
  "admin": false
}
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status: 401 UNAUTHORIZED |

```json
{
  "message": "Missing bearer token."
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 403 FORBIDDEN  |

```json
{
  // Rsposta de usuário não admin
  "message": "Insufficient permission."
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 404 NOT FOUND  |

```json
{
  "message": "User not found."
}
```

<h3>PATCH /users/:id</h3>
Atualização de usuário
(Apenas o usuário proprietário da conta e usuários admin podem acessar.)

| Request                |
| ---------------------- |
| Body: application/json |
| Auth: Bearer Token     |

```json
{
  "name": "User4",
  "password": "12345",
  "email": "user4@mail.com"
  // o campo "admin não pode ser alterado
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 200 OK         |

```json
{
  "id": "4a731054-9ec0-4e07-a309-f7112118a122",
  "name": "User4",
  "email": "user4@mail.com",
  "admin": false
}
```

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status: 401 UNAUTHORIZED |

```json
{
  "message": "Missing bearer token."
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 403 FORBIDDEN  |

```json
{
  // Rsposta de usuário não admin
  "message": "Insufficient permission."
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 404 NOT FOUND  |

```json
{
  "message": "User not found."
}
```

<h3>DELETE /users/:id</h3>
Rota de delelção de usuário pelo id
(Apenas o usuário proprietário da conta e usuários admin podem acessar.)

| Request            |
| ------------------ |
| Body: No content   |
| Auth: Bearer Token |

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 204 NO CONTENT |

| Response                 |
| ------------------------ |
| Body: application/json   |
| Status: 401 UNAUTHORIZED |

```json
{
  "message": "Missing bearer token."
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 403 FORBIDDEN  |

```json
{
  // Rsposta de usuário não admin
  "message": "Insufficient permission."
}
```

| Response               |
| ---------------------- |
| Body: application/json |
| Status: 404 NOT FOUND  |

```json
{
  "message": "User not found."
}
```
