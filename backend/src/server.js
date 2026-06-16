const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Servidor rodando com sucesso na porta ${PORT}`);
  console.log(` Acesse a documentação para testar os endpoints`);
  console.log(`===================================================`);
});

// Tratamento de finalização graciosa para fechar a conexão com o Prisma
const gracefulShutdown = async (signal) => {
  console.log(`Recebido sinal de desligamento (${signal}). Encerrando...`);
  server.close(async () => {
    console.log('Servidor HTTP encerrado.');
    await prisma.$disconnect();
    console.log('Prisma desconectado do banco de dados.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
