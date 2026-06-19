const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

class VisitanteService {
  async register({ nome, email, senha, cidade }) {
    if (!nome || !email || !senha) {
      const error = new Error('Os campos nome, email e senha são obrigatórios.');
      error.status = 400;
      throw error;
    }

    const existente = await prisma.visitante.findUnique({
      where: { email },
    });

    if (existente) {
      const error = new Error('E-mail já cadastrado.');
      error.status = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoVisitante = await prisma.visitante.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        cidade: cidade || null,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cidade: true,
        foto: true,
        createdAt: true,
      },
    });

    return novoVisitante;
  }

  async login(email, senha) {
    if (!email || !senha) {
      const error = new Error('E-mail e senha são obrigatórios.');
      error.status = 400;
      throw error;
    }

    const visitante = await prisma.visitante.findUnique({
      where: { email },
    });

    if (!visitante) {
      const error = new Error('Credenciais inválidas.');
      error.status = 401;
      throw error;
    }

    const senhaCorreta = await bcrypt.compare(senha, visitante.senha);

    if (!senhaCorreta) {
      const error = new Error('Credenciais inválidas.');
      error.status = 401;
      throw error;
    }

    const jwtSecret = process.env.JWT_SECRET || 'portal_turismo_ecologico_super_secret_key_12345!';
    const token = jwt.sign(
      { id: visitante.id, email: visitante.email, tipo: 'visitante' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      visitante: {
        id: visitante.id,
        nome: visitante.nome,
        email: visitante.email,
        foto: visitante.foto,
        cidade: visitante.cidade,
      },
      token,
    };
  }

  async getProfile(id) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      const error = new Error('ID inválido.');
      error.status = 400;
      throw error;
    }

    const visitante = await prisma.visitante.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        nome: true,
        email: true,
        foto: true,
        cidade: true,
        createdAt: true,
      },
    });

    if (!visitante) {
      const error = new Error('Visitante não encontrado.');
      error.status = 404;
      throw error;
    }

    return visitante;
  }

  async updateProfile(id, data) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      const error = new Error('ID inválido.');
      error.status = 400;
      throw error;
    }

    const visitante = await prisma.visitante.findUnique({
      where: { id: parsedId },
    });

    if (!visitante) {
      const error = new Error('Visitante não encontrado.');
      error.status = 404;
      throw error;
    }

    const { nome, cidade, foto } = data;

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (cidade !== undefined) updateData.cidade = cidade;
    if (foto !== undefined) updateData.foto = foto;

    const atualizado = await prisma.visitante.update({
      where: { id: parsedId },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        foto: true,
        cidade: true,
        createdAt: true,
      },
    });

    return atualizado;
  }
}

module.exports = new VisitanteService();
