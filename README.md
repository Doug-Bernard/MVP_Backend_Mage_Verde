# Portal de Turismo Ecológico - Magé Verde Online

Magé Verde Online é um portal de ecoturismo para o município de Magé (RJ). O projeto apresenta as principais atrações naturais da região — trilhas, cachoeiras, parques e eventos — e oferece uma API REST completa para gerenciamento dinâmico do conteúdo, com autenticação JWT para administradores e visitantes.

---

## Tecnologias Utilizadas

### Backend
- **Node.js** — Ambiente de execução JavaScript server-side
- **Express** — Framework web para construção de APIs REST
- **Prisma ORM** — Mapeamento objeto-relacional para banco de dados
- **SQLite** — Banco de dados relacional leve
- **JWT (JSON Web Token)** — Autenticação stateless
- **Bcrypt.js** — Criptografia de senhas

### Frontend
- **HTML5** — Estruturação das páginas
- **CSS3** — Estilização e layout responsivo
- **JavaScript (Vanilla JS)** — Manipulação do DOM e integração com a API

---

## Database (Prisma)

Arquivo `prisma/schema.prisma` com todos os models

### Credenciais do Administrador Padrão (seed)

| Campo  | Valor             |
|--------|-------------------|
| E-mail | admin2@gmail.com  |
| Senha  | admin1234         |

---
### Credenciais do Visitante Padrão (seed)

| Campo  | Valor             |
|--------|-------------------|
| E-mail | maria@test.com  |
| Senha  | 123456         |

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

Lista todas as atrações. Aceita filtro opcional: `?tipo=TRILHA | CACHOEIRA | EVENTO`.

**`GET /atracoes/:id`**

Retorna detalhes da atração, disponibilidade, comentários e média de avaliações.

**`POST /atracoes`** 🔒 (Admin)
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

**`PUT /atracoes/:id`** 🔒 (Admin)
<details>
<summary>Exemplo de Body</summary>

```json
{
  "nome": "Parque Nacional Atualizado",
  "descricao": "Trilhas ecológicas + área para piquenique",
  "tipo": "TRILHA",
  "localizacao": "Magé, RJ - Brasil",
  "imagem": "https://exemplo.com/nova-imagem.jpg"
}
```
</details>

**`DELETE /atracoes/:id`** 🔒 (Admin)

---

### 💬 Comentários

**`GET /comentarios/:atracaoId`**

Lista todos os comentários de uma atração.

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

**`PUT /comentarios/:id`** 🔒 (Visitante)
<details>
<summary>Exemplo de Body</summary>

```json
{
  "comentario": "Atualizei meu comentário!"
}
```
</details>

**`DELETE /comentarios/:id`** 🔒 (Admin)

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

Retorna as avaliações e a média geral da atração.

---

### 📅 Disponibilidade

**`GET /disponibilidade/:atracaoId`**

**`POST /disponibilidade`** 🔒 (Admin)
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

**`PUT /disponibilidade/:id`** 🔒 (Admin)
<details>
<summary>Exemplo de Body</summary>

```json
{
  "status": "MANUTENCAO",
  "horarioAbertura": "09:00",
  "horarioFechamento": "15:00",
  "observacao": "Em manutenção até novo aviso"
}
```
</details>

---

### 📰 Novidades

**`GET /novidades`**

**`POST /novidades`** 🔒 (Admin)
<details>
<summary>Exemplo de Body</summary>

```json
{
  "titulo": "Reabertura da Trilha das Orquídeas",
  "descricao": "Após manutenção, a trilha está aberta ao público."
}
```
</details>

**`PUT /novidades/:id`** 🔒 (Admin)

**`DELETE /novidades/:id`** 🔒 (Admin)

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

**`GET /visitantes/profile`** 🔒 (Visitante)

**`PUT /visitantes/profile`** 🔒 (Visitante)
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

## Autenticação

### 🔒 Rotas Protegidas

As rotas marcadas com 🔒 exigem token JWT no cabeçalho:

```
Authorization: Bearer <token>
```

- **Admin** — Token obtido em `POST /auth/login` (armazenar em `@PortalTurismo:token`)
- **Visitante** — Token obtido em `POST /visitantes/login` (armazenar em `@PortalTurismo:visitanteToken`)

---

## Arquitetura do Projeto

```
MVP_BACKEND(2)/
├── backend/
│   ├── prisma/
│   │   ├── dev.db
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── MVP-Front-End-Development/
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   ├── cadastro.html
│   ├── visitante-login.html
│   ├── visitante.html
│   ├── avaliar.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── README.md
│
└── README.md
```

---

## Equipe

- Douglas Bernard Martins Teixeira da Silva
- Mariana Oliveira Lopes

---

## Status do Projeto

✅ MVP Backend concluído — API REST funcional com todas as rotas, autenticação JWT e banco SQLite.
✅ MVP Frontend estruturado — Site estático com páginas HTML, CSS e integração parcial com a API.

*Projeto acadêmico para as disciplinas de Desenvolvimento Web Front-End e MVP Back-End Development.*
