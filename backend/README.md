# Portal de Turismo Ecológico - Backend API

Esta é a API REST completa desenvolvida como o MVP Backend para o projeto acadêmico **Portal de Turismo Ecológico**. A API fornece os dados dinâmicos necessários para o frontend, implementa a lógica de negócios e persistência de dados em um banco de dados SQLite (usando o Prisma ORM), além de garantir o controle de acesso administrativo por meio de tokens JWT.

---

## 🚀 Tecnologias Utilizadas

*   **Node.js**: Ambiente de execução Javascript Server-side.
*   **Express**: Framework web minimalista para construção de APIs REST em Node.js.
*   **Prisma ORM**: Object-Relational Mapping (ORM) moderno para manipulação e consulta ao banco de dados relacional de forma tipada e segura.
*   **SQLite**: Banco de dados relacional leve e sem necessidade de configuração de servidores externos, ideal para MVPs e ambientes de desenvolvimento.
*   **JWT (JSON Web Token)**: Mecanismo de autenticação stateless baseado em tokens para proteção de rotas administrativas.
*   **Bcrypt.js**: Biblioteca para criptografia e verificação de senhas.
*   **CORS**: Middleware para habilitar a comunicação segura com o frontend hospedado em diferentes portas ou domínios.

---

## 📁 Estrutura de Pastas do Projeto

O projeto adota uma arquitetura em camadas estruturada da seguinte forma:

```
backend/
├── prisma/
│   ├── dev.db             # Banco de dados SQLite local (gerado automaticamente)
│   ├── schema.prisma      # Modelagem das entidades e relações do banco
│   └── seed.js            # Popular o banco inicial com admin e dados de exemplo
├── src/
│   ├── config/
│   │   └── prisma.js      # Instanciação centralizada do Prisma Client
│   ├── controllers/       # Camada de Controllers (Tratamento HTTP e retorno de respostas)
│   │   ├── authController.js
│   │   ├── atracaoController.js
│   │   ├── disponibilidadeController.js
│   │   ├── comentarioController.js
│   │   ├── avaliacaoController.js
│   │   └── novidadeController.js
│   ├── middlewares/       # Middlewares Express (Autenticação JWT, tratamento global de erros)
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/            # Definição e agrupamento dos Endpoints REST
│   │   ├── authRoutes.js
│   │   ├── atracaoRoutes.js
│   │   ├── disponibilidadeRoutes.js
│   │   ├── comentarioRoutes.js
│   │   ├── avaliacaoRoutes.js
│   │   ├── novidadeRoutes.js
│   │   └── index.js
│   ├── services/          # Camada de Services (Lógica de negócios e chamadas ao banco)
│   │   ├── authService.js
│   │   ├── atracaoService.js
│   │   ├── disponibilidadeService.js
│   │   ├── comentarioService.js
│   │   ├── avaliacaoService.js
│   │   └── novidadeService.js
│   ├── app.js             # Configuração do Express, CORS e tratamento de erros
│   └── server.js          # Inicialização do servidor HTTP e finalização graciosa
├── .env                   # Variáveis de ambiente locais (portas, segredos, URLs)
├── .env.example           # Modelo para configuração das variáveis de ambiente
└── package.json           # Dependências e scripts de execução do npm
```

---

## 🛠️ Passo a Passo para Executar o Projeto Localmente

Siga as etapas abaixo para configurar e inicializar o servidor de desenvolvimento:

### 1. Pré-requisitos
Certifique-se de possuir o **Node.js** (versão 18 ou superior) instalado em sua máquina.

### 2. Instalar as Dependências
Abra o terminal na pasta `backend` e execute:
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
O projeto já conta com um arquivo `.env` pré-configurado. Se desejar alterá-lo, crie uma cópia ou renomeie o `.env.example` para `.env` e ajuste os valores:
*   `PORT`: Porta onde o servidor Express vai rodar (padrão: `5000`).
*   `DATABASE_URL`: Caminho do SQLite. Mantido como `"file:./dev.db"`.
*   `JWT_SECRET`: Chave secreta de criptografia para assinar os tokens de administrador.

### 4. Executar as Migrações e o Seed
Execute o comando abaixo para gerar o arquivo do banco SQLite, criar todas as tabelas com seus respectivos relacionamentos e aplicar o seed (inserindo o administrador padrão e dados ecológicos iniciais para teste):
```bash
npm run prisma:migrate
```

*(Caso o banco já exista e você queira apenas forçar uma nova execução do seed, rode: `npm run prisma:seed`)*

### 5. Rodar o Servidor em Modo de Desenvolvimento
Para iniciar o backend com o **Nodemon** (que reinicia o servidor automaticamente a cada alteração de código), execute:
```bash
npm run dev
```

O terminal exibirá:
```text
===================================================
 Servidor rodando com sucesso na porta 5000
 Acesse a documentação para testar os endpoints
===================================================
```
Para testar a saúde da API, você pode acessar em seu navegador ou ferramenta de teste:
`http://localhost:5000/status`

---

## 🗺️ Endpoints da API REST

Abaixo, a lista completa de rotas configuradas na API:

| Método | Endpoint | Protegido? | Descrição |
| :--- | :--- | :---: | :--- |
| **POST** | `/auth/register` | Não | Cadastro de um novo administrador. |
| **POST** | `/auth/login` | Não | Autenticação do administrador, retorna dados do admin e token JWT. |
| **GET** | `/atracoes` | Não | Lista atrações. Aceita filtro query `?tipo=TRILHA` ou `CACHOEIRA`/`EVENTO`. |
| **GET** | `/atracoes/:id` | Não | Retorna detalhes da atração, sua disponibilidade, comentários e média de notas. |
| **POST** | `/atracoes` | **Sim (JWT)** | Cria uma nova atração. |
| **PUT** | `/atracoes/:id` | **Sim (JWT)** | Atualiza dados cadastrais de uma atração. |
| **DELETE** | `/atracoes/:id` | **Sim (JWT)** | Remove uma atração (deleta em cascata comentários/avaliações/status). |
| **GET** | `/disponibilidade/:atracaoId` | Não | Consulta as informações de horário e status de uma atração. |
| **POST** | `/disponibilidade` | **Sim (JWT)** | Define ou sobrescreve a disponibilidade de uma atração. |
| **PUT** | `/disponibilidade/:id` | **Sim (JWT)** | Edita as informações de uma disponibilidade existente. |
| **GET** | `/comentarios/:atracaoId` | Não | Obtém a lista de comentários de uma atração. |
| **POST** | `/comentarios` | Não | Cadastra um novo comentário público para uma atração. |
| **DELETE** | `/comentarios/:id` | **Sim (JWT)** | Remove um comentário do sistema. |
| **GET** | `/avaliacoes/:atracaoId` | Não | Obtém todas as notas de uma atração e a média geral calculada. |
| **POST** | `/avaliacoes` | Não | Envia uma avaliação de 1 a 5 estrelas para uma atração. |
| **GET** | `/novidades` | Não | Lista todas as novidades ordenadas pelas mais recentes. |
| **POST** | `/novidades` | **Sim (JWT)** | Publica uma nova novidade/comunicado. |
| **PUT** | `/novidades/:id` | **Sim (JWT)** | Edita uma novidade publicada. |
| **DELETE** | `/novidades/:id` | **Sim (JWT)** | Exclui uma novidade. |

---

## 🔌 Integração: Conectando o Frontend Existente à API

Atualmente, o frontend armazena informações estáticas ou simula operações de alteração de estado em memória local (`localStorage` ou objetos). Para conectá-lo a esta API REST, você deve substituir essas lógicas por requisições `fetch` reais enviadas ao servidor.

### Exemplos Práticos de Requisição em JavaScript

#### 1. Autenticação Administrativa (Login)
No arquivo de login (`login.js`), substitua a verificação mockada pela chamada HTTP:

```javascript
// js/login.js
const loginForm = document.querySelector('.loginForm');

async function handleFormSubmit(event) {
  event.preventDefault();
  const email = event.target.emailInput.value;
  const senha = event.target.passwordInput.value;

  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Credenciais inválidas');
      return;
    }

    // Salvar o token JWT e informações do administrador no localStorage
    localStorage.setItem('@PortalTurismo:token', data.token);
    localStorage.setItem('@PortalTurismo:admin', JSON.stringify(data.admin));

    // Redireciona para o painel administrativo
    window.location.href = 'admin.html';
  } catch (error) {
    console.error('Erro ao conectar ao servidor:', error);
    alert('Erro de conexão com o servidor. Tente novamente mais tarde.');
  }
}

loginForm.addEventListener('submit', handleFormSubmit);
```

#### 2. Exibição de Atrações na Página Inicial (Listagem Pública)
Utilize para renderizar dinamicamente as trilhas, cachoeiras e eventos ecológicos na sua home page:

```javascript
async function carregarAtracoes() {
  try {
    const response = await fetch('http://localhost:5000/atracoes');
    const atracoes = await response.json();

    const container = document.getElementById('container-atracoes');
    container.innerHTML = '';

    atracoes.forEach(atracao => {
      // Exemplo de renderização de cards dinâmicos
      container.innerHTML += `
        <div class="card">
          <img src="${atracao.imagem || 'assets/default.jpg'}" alt="${atracao.nome}">
          <h3>${atracao.nome}</h3>
          <p>${atracao.tipo} - ${atracao.localizacao}</p>
          <span>Nota Média: ⭐ ${atracao.mediaAvaliacao} (${atracao.totalAvaliacoes} avaliações)</span>
          <p>Status: <strong>${atracao.disponibilidade?.status || 'NÃO DEFINIDO'}</strong></p>
          <a href="detalhes.html?id=${atracao.id}">Ver Detalhes</a>
        </div>
      `;
    });
  } catch (error) {
    console.error('Erro ao buscar atrações:', error);
  }
}
```

#### 3. Buscar Detalhes de uma Atração (com comentários e avaliações)
Ao abrir a página de detalhes de uma atração específica:

```javascript
// Obter o ID da atração a partir dos parâmetros da URL (?id=1)
const urlParams = new URLSearchParams(window.location.search);
const atracaoId = urlParams.get('id');

async function carregarDetalhesAtracao() {
  try {
    const response = await fetch(`http://localhost:5000/atracoes/${atracaoId}`);
    const atracao = await response.json();

    // Atualiza o HTML com as informações detalhadas
    document.getElementById('titulo').innerText = atracao.nome;
    document.getElementById('descricao').innerText = atracao.descricao;
    document.getElementById('imagem').src = atracao.imagem;
    
    // Mostra o status de funcionamento
    const disp = atracao.disponibilidade;
    document.getElementById('status').innerText = `Status: ${disp?.status || 'Fechado'}`;
    document.getElementById('horarios').innerText = `Horário: ${disp?.horarioAbertura} até ${disp?.horarioFechamento}`;

    // Mostra comentários
    const comentariosContainer = document.getElementById('comentarios');
    comentariosContainer.innerHTML = atracao.comentarios.map(c => `
      <div class="comentario">
        <strong>${c.nomeUsuario}</strong> em ${new Date(c.createdAt).toLocaleDateString()}:
        <p>${c.comentario}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
  }
}
```

#### 4. Enviar Comentário (Público)
```javascript
async function enviarComentario(nomeUsuario, comentario) {
  try {
    const response = await fetch('http://localhost:5000/comentarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeUsuario, comentario, atracaoId: Number(atracaoId) }),
    });

    if (response.ok) {
      alert('Comentário enviado com sucesso!');
      location.reload(); // Recarrega a página para exibir o novo comentário
    }
  } catch (error) {
    console.error('Erro ao enviar comentário:', error);
  }
}
```

#### 5. Operação Protegida - Criar Nova Atração (Painel Administrativo)
Para cadastrar uma atração, você deve anexar o token JWT salvo no cabeçalho `Authorization`:

```javascript
async function criarAtracao(nome, descricao, tipo, localizacao, imagem) {
  const token = localStorage.getItem('@PortalTurismo:token');

  if (!token) {
    alert('Acesso negado. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/atracoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Envia o token JWT
      },
      body: JSON.stringify({ nome, descricao, tipo, localizacao, imagem }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Erro ao criar atração.');
      return;
    }

    alert('Atração cadastrada com sucesso!');
    window.location.href = 'admin.html';
  } catch (error) {
    console.error('Erro ao cadastrar atração:', error);
  }
}
```

---

## 🔐 Configuração do Administrador Padrão

O script de seed pré-cadastra um administrador padrão para possibilitar o login imediato no sistema:

*   **E-mail**: `admin@gmail.com`
*   **Senha**: `admin123`
