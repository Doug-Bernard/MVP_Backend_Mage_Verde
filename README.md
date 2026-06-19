# Portal de Turismo Ecológico - Magé Verde Online

API para gerenciar atrações turísticas do município de Magé (RJ), incluindo cadastro de lugares, avaliações, comentários, disponibilidade e autenticação.

---

## 🚀 Tecnologias

- **Node.js**
- **Express**
- **Prisma ORM**
- **JWT**
- **Bcrypt.js**
- **SQLite**

---

## 📁 Estrutura do Projeto

```
backend/
  src/
    config/
      prisma.js
    controllers/
      authController.js
      atracaoController.js
      comentarioController.js
      avaliacaoController.js
      disponibilidadeController.js
      novidadeController.js
      visitanteController.js
    middlewares/
      authMiddleware.js
      errorMiddleware.js
      optionalVisitanteAuth.js
      visitanteAuthMiddleware.js
    routes/
      index.js
      authRoutes.js
      atracaoRoutes.js
      comentarioRoutes.js
      avaliacaoRoutes.js
      disponibilidadeRoutes.js
      novidadeRoutes.js
      visitanteRoutes.js
    services/
      authService.js
      atracaoService.js
      comentarioService.js
      avaliacaoService.js
      disponibilidadeService.js
      novidadeService.js
      visitanteService.js
    app.js
    server.js

  prisma/
    schema.prisma
    seed.js

MVP-Front-End-Development/
  index.html
  login.html
  admin.html
  cadastro.html
  visitante-login.html
  visitante.html
  avaliar.html
  css/
  js/
  assets/
```

---

## 🔐 Autenticação

- Registro e login de administradores.
- Registro e login de visitantes.
- Tokens JWT.
- Middleware `authMiddleware`.
- Middleware `visitanteAuthMiddleware`.

---

## 📍 Atrações

- CRUD completo.
- Ligação com comentários, avaliações e disponibilidade.
- Filtro por tipo (TRILHA, CACHOEIRA, EVENTO).

---

## ⭐ Avaliações

- Qualquer pessoa pode avaliar uma atração.
- Visitante autenticado pode atualizar sua própria nota.
- Retorna média e total de avaliações.

---

## 💬 Comentários

- Cadastro público.
- Visitante autenticado pode editar seus próprios comentários.
- Administrador pode excluir qualquer comentário.

---

## 🕒 Disponibilidade

- Define horários e status de funcionamento da atração.
- Status: ABERTO, FECHADO, MANUTENCAO.

---

## 📰 Novidades

- CRUD completo restrito a administradores.
- Listagem pública ordenada por data.

---

## 🗄 Database (Prisma)

Arquivo `prisma/schema.prisma` com todos os models:

```prisma
model Administrador {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  senha     String
  createdAt DateTime @default(now())
}

model Atracao {
  id             Int              @id @default(autoincrement())
  nome           String
  descricao      String
  tipo           String
  localizacao    String
  imagem         String
  createdAt      DateTime         @default(now())
  disponibilidade Disponibilidade?
  comentarios     Comentario[]
  avaliacoes      Avaliacao[]
}

model Disponibilidade {
  id                Int      @id @default(autoincrement())
  status            String
  horarioAbertura   String
  horarioFechamento String
  observacao        String?
  atracaoId         Int      @unique
  atracao           Atracao  @relation(fields: [atracaoId], references: [id], onDelete: Cascade)
}

model Visitante {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  senha     String
  foto      String?
  cidade    String?
  createdAt DateTime @default(now())
  comentarios Comentario[]
  avaliacoes  Avaliacao[]
}

model Comentario {
  id          Int      @id @default(autoincrement())
  nomeUsuario String
  comentario  String
  createdAt   DateTime @default(now())
  atracaoId   Int
  atracao     Atracao  @relation(fields: [atracaoId], references: [id], onDelete: Cascade)
  visitanteId Int?
  visitante   Visitante? @relation(fields: [visitanteId], references: [id], onDelete: SetNull)
}

model Avaliacao {
  id          Int      @id @default(autoincrement())
  nomeUsuario String
  nota        Int
  createdAt   DateTime @default(now())
  atracaoId   Int
  atracao     Atracao  @relation(fields: [atracaoId], references: [id], onDelete: Cascade)
  visitanteId Int?
  visitante   Visitante? @relation(fields: [visitanteId], references: [id], onDelete: SetNull)
}

model Novidade {
  id        Int      @id @default(autoincrement())
  titulo    String
  descricao String
  createdAt DateTime @default(now())
}
```

---

## ▶️ Rodando o Projeto

Renomeie o arquivo `.env.example` para `.env` e depois execute no terminal:

```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

---

## 📌 Rotas Principais

### 🔐 Auth

**`POST /auth/register`**
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nome": "Administrador",
  "email": "admin@example.com",
  "senha": "123456"
}
```
</details>

**`POST /auth/login`**
<details>
<summary>Exemplo de Body</summary>

```json
{
  "email": "admin@example.com",
  "senha": "123456"
}
```
</details>

---

### 📍 Atrações

**`GET /atracoes`**

**`GET /atracoes/:id`**

**`POST /atracoes`** 🔒 Admin
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nome": "Parque Nacional",
  "descricao": "Área verde com trilhas ecológicas",
  "tipo": "TRILHA",
  "localizacao": "Magé, RJ",
  "imagem": "https://exemplo.com/imagem.jpg"
}
```
</details>

**`PUT /atracoes/:id`** 🔒 Admin
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nome": "Parque Nacional Atualizado",
  "descricao": "Trilhas ecológicas + área para piquenique",
  "tipo": "TRILHA",
  "localizacao": "Magé, RJ - Brasil"
}
```
</details>

**`DELETE /atracoes/:id`** 🔒 Admin

---

### 💬 Comentários

**`GET /comentarios/:atracaoId`**

**`POST /comentarios`**
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nomeUsuario": "Carlos",
  "comentario": "Lugar incrível!",
  "atracaoId": 1
}
```
</details>

**`PUT /comentarios/:id`** 🔒 Visitante
<details>
<summary>Exemplo de Body</summary>

```json
{
  "comentario": "Atualizei meu comentário!"
}
```
</details>

**`DELETE /comentarios/:id`** 🔒 Admin

---

### ⭐ Avaliações

**`POST /avaliacoes`**
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nomeUsuario": "Carlos",
  "nota": 5,
  "atracaoId": 1
}
```
</details>

**`GET /avaliacoes/:atracaoId`**

---

### 📅 Disponibilidade

**`GET /disponibilidade/:atracaoId`**

**`POST /disponibilidade`** 🔒 Admin
<details>
<summary>Exemplo de Body</summary>

```json
{
  "atracaoId": 1,
  "status": "ABERTO",
  "horarioAbertura": "08:00",
  "horarioFechamento": "17:00",
  "observacao": "Aberto somente pela manhã"
}
```
</details>

**`PUT /disponibilidade/:id`** 🔒 Admin
<details>
<summary>Exemplo de Body</summary>

```json
{
  "status": "MANUTENCAO",
  "horarioAbertura": "09:00",
  "horarioFechamento": "15:00"
}
```
</details>

---

### 📰 Novidades

**`GET /novidades`**

**`POST /novidades`** 🔒 Admin
<details>
<summary>Exemplo de Body</summary>

```json
{
  "titulo": "Reabertura da Trilha das Orquídeas",
  "descricao": "Após manutenção, a trilha está aberta ao público."
}
```
</details>

**`PUT /novidades/:id`** 🔒 Admin

**`DELETE /novidades/:id`** 🔒 Admin

---

### 👤 Visitantes

**`POST /visitantes/register`**
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nome": "Carlos Silva",
  "email": "carlos@email.com",
  "senha": "123456",
  "cidade": "Magé, RJ"
}
```
</details>

**`POST /visitantes/login`**
<details>
<summary>Exemplo de Body</summary>

```json
{
  "email": "carlos@email.com",
  "senha": "123456"
}
```
</details>

**`GET /visitantes/profile`** 🔒 Visitante

**`PUT /visitantes/profile`** 🔒 Visitante
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nome": "Carlos Atualizado",
  "cidade": "Petrópolis, RJ",
  "foto": "https://exemplo.com/foto.jpg"
}
```
</details>

---

## 👥 Participantes do Projeto

- Douglas Bernard Martins Teixeira da Silva
- Luidi de Souza Pires
- Mariana Martins da Silva
- Mariana Oliveira Lopes
