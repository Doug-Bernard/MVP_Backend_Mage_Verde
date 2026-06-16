const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

class AuthService {
  async register(nome, email, senha) {
    if (!nome || !email || !senha) {
      const error = new Error('Todos os campos (nome, email, senha) são obrigatórios.');
      error.status = 400;
      throw error;
    }

    // Verificar se o administrador já existe
    const adminExistente = await prisma.administrador.findUnique({
      where: { email },
    });

    if (adminExistente) {
      const error = new Error('E-mail já cadastrado por outro administrador.');
      error.status = 409;
      throw error;
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Salvar no banco
    const novoAdmin = await prisma.administrador.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });

    return novoAdmin;
  }

  async login(email, senha) {
    if (!email || !senha) {
      const error = new Error('E-mail e senha são obrigatórios.');
      error.status = 400;
      throw error;
    }

    // Buscar administrador por e-mail
    const admin = await prisma.administrador.findUnique({
      where: { email },
    });

    if (!admin) {
      const error = new Error('Credenciais inválidas.');
      error.status = 401;
      throw error;
    }

    // Comparar senhas
    const senhaCorreta = await bcrypt.compare(senha, admin.senha);

    if (!senhaCorreta) {
      const error = new Error('Credenciais inválidas.');
      error.status = 401;
      throw error;
    }

    // Gerar token JWT
    const jwtSecret = process.env.JWT_SECRET || 'portal_turismo_ecologico_super_secret_key_12345!';
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
      },
      token,
    };
  }
}

module.exports = new AuthService();
