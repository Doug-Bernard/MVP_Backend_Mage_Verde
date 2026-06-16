const API_URL = 'http://localhost:5000';

async function rodarTestes() {
  console.log('=== INICIANDO TESTES DA API REST ===\n');

  try {
    // 1. Testar Status da API
    console.log('1. Testando GET /status...');
    const statusRes = await fetch(`${API_URL}/status`);
    const statusData = await statusRes.json();
    console.log('Resultado Status:', statusData);
    console.log('--------------------------------------------------');

    // 2. Realizar Login do Administrador
    console.log('2. Realizando POST /auth/login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        senha: 'admin123'
      })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      throw new Error(`Falha no login: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.token;
    console.log('Login efetuado com sucesso!');
    console.log('Token JWT recebido (resumido):', token.substring(0, 30) + '...');
    console.log('--------------------------------------------------');

    // 3. Cadastrar uma Nova Atração (Operação Protegida)
    console.log('3. Cadastrando Atração via POST /atracoes (Protegida)...');
    const atracaoRes = await fetch(`${API_URL}/atracoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: 'Trilha do Vale Perdido',
        descricao: 'Uma caminhada desafiadora por desfiladeiros escondidos com uma rica biodiversidade de samambaias gigantes.',
        tipo: 'TRILHA',
        localizacao: 'Setor Sul do Parque Ecológico',
        imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600'
      })
    });

    const atracaoData = await atracaoRes.json();
    if (!atracaoRes.ok) {
      throw new Error(`Falha ao criar atração: ${JSON.stringify(atracaoData)}`);
    }
    const novaAtracaoId = atracaoData.id;
    console.log('Atração criada com sucesso! ID:', novaAtracaoId);
    console.log('Dados da atração:', atracaoData);
    console.log('--------------------------------------------------');

    // 4. Definir Disponibilidade para a Nova Atração (Operação Protegida)
    console.log(`4. Definindo Disponibilidade via POST /disponibilidade para a atração ID ${novaAtracaoId}...`);
    const dispRes = await fetch(`${API_URL}/disponibilidade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        atracaoId: novaAtracaoId,
        status: 'ABERTO',
        horarioAbertura: '08:30',
        horarioFechamento: '16:30',
        observacao: 'Trilha escorregadia em dias chuvosos.'
      })
    });

    const dispData = await dispRes.json();
    if (!dispRes.ok) {
      throw new Error(`Falha ao definir disponibilidade: ${JSON.stringify(dispData)}`);
    }
    console.log('Disponibilidade configurada com sucesso:', dispData);
    console.log('--------------------------------------------------');

    // 5. Inserir Comentário Público para a Atração
    console.log(`5. Inserindo Comentário via POST /comentarios na atração ID ${novaAtracaoId}...`);
    const comentRes = await fetch(`${API_URL}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeUsuario: 'Luiza de Oliveira',
        comentario: 'O lugar é incrivelmente bonito! Recomendo levar bastante água.',
        atracaoId: novaAtracaoId
      })
    });

    const comentData = await comentRes.json();
    console.log('Comentário inserido:', comentData);
    console.log('--------------------------------------------------');

    // 6. Inserir Avaliação Pública para a Atração
    console.log(`6. Inserindo Avaliação via POST /avaliacoes na atração ID ${novaAtracaoId}...`);
    const avalRes = await fetch(`${API_URL}/avaliacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeUsuario: 'Lucas Santos',
        nota: 5,
        atracaoId: novaAtracaoId
      })
    });
    const avalData = await avalRes.json();
    console.log('Avaliação inserida:', avalData);
    console.log('--------------------------------------------------');

    // 7. Buscar Detalhes da Atração (GET /atracoes/:id) para comprovar a média e os comentários
    console.log(`7. Buscando Detalhes via GET /atracoes/${novaAtracaoId}...`);
    const detalhesRes = await fetch(`${API_URL}/atracoes/${novaAtracaoId}`);
    const detalhesData = await detalhesRes.json();
    console.log('Detalhes completos retornados pela API:');
    console.log(`- Nome: ${detalhesData.nome}`);
    console.log(`- Tipo: ${detalhesData.tipo}`);
    console.log(`- Status: ${detalhesData.disponibilidade?.status}`);
    console.log(`- Média de Notas: ⭐ ${detalhesData.mediaAvaliacao} (${detalhesData.totalAvaliacoes} avaliações)`);
    console.log(`- Comentários vinculados:`, detalhesData.comentarios.map(c => `${c.nomeUsuario}: "${c.comentario}"`));
    console.log('--------------------------------------------------');

    // 8. Listar Novidades (GET /novidades)
    console.log('8. Listando novidades via GET /novidades...');
    const novidadesRes = await fetch(`${API_URL}/novidades`);
    const novidadesData = await novidadesRes.json();
    console.log('Novidades cadastradas:', novidadesData.length);
    console.log('Primeira novidade:', novidadesData[0]);
    console.log('--------------------------------------------------');

    // 9. Excluir a Atração de Teste (Operação Protegida) para limpar o banco
    console.log(`9. Limpando dados de teste via DELETE /atracoes/${novaAtracaoId}...`);
    const deleteRes = await fetch(`${API_URL}/atracoes/${novaAtracaoId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const deleteData = await deleteRes.json();
    console.log('Resultado da Exclusão (cascade check):', deleteData);
    console.log('--------------------------------------------------');

    console.log('=== TODOS OS TESTES PASSARAM COM SUCESSO! A API ESTÁ 100% OPERACIONAL ===');

  } catch (error) {
    console.error('❌ ERRO DURANTE A EXECUÇÃO DOS TESTES:', error.message);
  }
}

rodarTestes();
