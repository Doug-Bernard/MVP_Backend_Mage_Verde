const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding do banco de dados...');

  // 1. Limpar dados existentes (opcional, para garantir idempotência)
  await prisma.comentario.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.disponibilidade.deleteMany();
  await prisma.atracao.deleteMany();
  await prisma.novidade.deleteMany();
  await prisma.administrador.deleteMany();

  console.log('Dados anteriores limpos.');

  // 2. Criar Administrador Padrão
  const salt = await bcrypt.genSalt(10);
  const senhaCriptografada = await bcrypt.hash('admin1234', salt);

  const admin = await prisma.administrador.create({
    data: {
      nome: 'Administrador do Portal',
      email: 'admin2@gmail.com',
      senha: senhaCriptografada,
    },
  });

  console.log(`Administrador padrão criado: ${admin.email}`);

  // 3. Criar Atrações de Exemplo (TRILHA, CACHOEIRA, EVENTO)
  const atracao1 = await prisma.atracao.create({
    data: {
      nome: 'Trilha do Mirante da Serra',
      descricao: 'Uma trilha de nível moderado com uma vista incrível de toda a cordilheira e vegetação preservada da Mata Atlântica.',
      tipo: 'TRILHA',
      localizacao: 'Parque Nacional, Setor A',
      imagem: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=600&auto=format&fit=crop',
      disponibilidade: {
        create: {
          status: 'ABERTO',
          horarioAbertura: '08:00',
          horarioFechamento: '17:00',
          observacao: 'Uso de calçado fechado é obrigatório.',
        }
      }
    }
  });

  const atracao2 = await prisma.atracao.create({
    data: {
      nome: 'Cachoeira do Véu da Noiva',
      descricao: 'Uma das cachoeiras mais belas da região, com queda livre de 40 metros e poço perfeito para banho refrescante.',
      tipo: 'CACHOEIRA',
      localizacao: 'Vale das Borboletas, Km 12',
      imagem: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop',
      disponibilidade: {
        create: {
          status: 'ABERTO',
          horarioAbertura: '07:00',
          horarioFechamento: '16:00',
          observacao: 'Evitar em caso de previsão de chuvas fortes (tromba d\'água).',
        }
      }
    }
  });

  const atracao3 = await prisma.atracao.create({
    data: {
      nome: 'Caminhada Ecológica Noturna da Lua Cheia',
      descricao: 'Evento ecológico guiado para observação da fauna noturna e contemplação das constelações sob a luz da lua cheia.',
      tipo: 'EVENTO',
      localizacao: 'Ponto de Encontro: Centro de Visitantes',
      imagem: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
      disponibilidade: {
        create: {
          status: 'ABERTO',
          horarioAbertura: '19:00',
          horarioFechamento: '23:00',
          observacao: 'Vagas limitadas. Levar lanterna.',
        }
      }
    }
  });

  console.log('Atrações e disponibilidades de exemplo criadas.');

  // 4. Criar Comentários e Avaliações de Exemplo para a Trilha (atracao1)
  await prisma.comentario.createMany({
    data: [
      {
        nomeUsuario: 'Carlos Silva',
        comentario: 'Trilha maravilhosa! A sinalização é ótima e a vista no final compensa todo o esforço físico.',
        atracaoId: atracao1.id,
      },
      {
        nomeUsuario: 'Mariana Costa',
        comentario: 'Fui com guias locais e foi excelente. Muito contato com a natureza.',
        atracaoId: atracao1.id,
      }
    ]
  });

  await prisma.avaliacao.createMany({
    data: [
      { nomeUsuario: 'Carlos Silva', nota: 5, atracaoId: atracao1.id },
      { nomeUsuario: 'Mariana Costa', nota: 4, atracaoId: atracao1.id }
    ]
  });

  // 5. Criar Avaliações para a Cachoeira (atracao2)
  await prisma.avaliacao.createMany({
    data: [
      { nomeUsuario: 'Alice Souza', nota: 5, atracaoId: atracao2.id },
      { nomeUsuario: 'Roberto Melo', nota: 5, atracaoId: atracao2.id }
    ]
  });

  console.log('Comentários e avaliações iniciais criados.');

  // 6. Criar Novidades
  await prisma.novidade.createMany({
    data: [
      {
        titulo: 'Reabertura da Trilha das Orquídeas',
        descricao: 'Após 3 meses fechada para manutenção de pontes e reflorestamento de encostas, a Trilha das Orquídeas está oficialmente aberta ao público com novos corrimãos de segurança.',
      },
      {
        titulo: 'Campanha de Preservação: Lixo Zero nas Cachoeiras',
        descricao: 'Lançamos uma campanha educativa para incentivar os turistas a trazerem de volta todo o lixo produzido. Haverá pontos de descarte ecológico nas entradas das trilhas.',
      }
    ]
  });

  console.log('Novidades de exemplo criadas.');
  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
