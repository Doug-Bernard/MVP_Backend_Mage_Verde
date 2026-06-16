const prisma = require('../config/prisma');

class DisponibilidadeService {
  async define(data) {
    const { atracaoId, status, horarioAbertura, horarioFechamento, observacao } = data;

    const parsedAtracaoId = parseInt(atracaoId, 10);
    if (isNaN(parsedAtracaoId)) {
      const error = new Error('atracaoId inválido.');
      error.status = 400;
      throw error;
    }

    if (!status || !horarioAbertura || !horarioFechamento) {
      const error = new Error('Os campos status, horarioAbertura e horarioFechamento são obrigatórios.');
      error.status = 400;
      throw error;
    }

    const statusNormalizado = status.toUpperCase();
    if (!['ABERTO', 'FECHADO', 'MANUTENCAO'].includes(statusNormalizado)) {
      const error = new Error('Status inválido. Deve ser ABERTO, FECHADO ou MANUTENCAO.');
      error.status = 400;
      throw error;
    }

    // Verificar se a atração existe
    const atracao = await prisma.atracao.findUnique({
      where: { id: parsedAtracaoId },
    });

    if (!atracao) {
      const error = new Error('Atração não encontrada.');
      error.status = 404;
      throw error;
    }

    // Definir ou atualizar (Upsert) a disponibilidade para evitar erros de restrição única
    const disponibilidade = await prisma.disponibilidade.upsert({
      where: { atracaoId: parsedAtracaoId },
      update: {
        status: statusNormalizado,
        horarioAbertura,
        horarioFechamento,
        observacao: observacao || null,
      },
      create: {
        atracaoId: parsedAtracaoId,
        status: statusNormalizado,
        horarioAbertura,
        horarioFechamento,
        observacao: observacao || null,
      },
    });

    return disponibilidade;
  }

  async update(id, data) {
    const dispId = parseInt(id, 10);
    if (isNaN(dispId)) {
      const error = new Error('ID de disponibilidade inválido.');
      error.status = 400;
      throw error;
    }

    // Verificar se a disponibilidade existe
    const dispExistente = await prisma.disponibilidade.findUnique({
      where: { id: dispId },
    });

    if (!dispExistente) {
      const error = new Error('Disponibilidade não encontrada.');
      error.status = 404;
      throw error;
    }

    const { status, horarioAbertura, horarioFechamento, observacao } = data;

    const updateData = {};
    if (status) {
      const statusNormalizado = status.toUpperCase();
      if (!['ABERTO', 'FECHADO', 'MANUTENCAO'].includes(statusNormalizado)) {
        const error = new Error('Status inválido. Deve ser ABERTO, FECHADO ou MANUTENCAO.');
        error.status = 400;
        throw error;
      }
      updateData.status = statusNormalizado;
    }

    if (horarioAbertura) updateData.horarioAbertura = horarioAbertura;
    if (horarioFechamento) updateData.horarioFechamento = horarioFechamento;
    if (observacao !== undefined) updateData.observacao = observacao;

    const dispAtualizada = await prisma.disponibilidade.update({
      where: { id: dispId },
      data: updateData,
    });

    return dispAtualizada;
  }

  async findByAtracaoId(atracaoId) {
    const parsedAtracaoId = parseInt(atracaoId, 10);
    if (isNaN(parsedAtracaoId)) {
      const error = new Error('atracaoId inválido.');
      error.status = 400;
      throw error;
    }

    // Buscar a disponibilidade vinculada a esta atração
    const disponibilidade = await prisma.disponibilidade.findUnique({
      where: { atracaoId: parsedAtracaoId },
    });

    if (!disponibilidade) {
      const error = new Error('Nenhuma disponibilidade cadastrada para esta atração.');
      error.status = 404;
      throw error;
    }

    return disponibilidade;
  }
}

module.exports = new DisponibilidadeService();
