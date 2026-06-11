// arquivo services/api.ts
// camada de serviço que centraliza todas as chamadas HTTP ao backend da Clínica SEP

// URL base do servidor backend
// em desenvolvimento usa localhost, em produção troca pelo endereço do servidor
export // endereço IP da máquina na rede local — necessário para o celular acessar o backend
const API_URL = 'http://localhost:3000';

// função auxiliar para montar os headers padrão das requisições
// inclui o token JWT quando disponível para rotas autenticadas
function montarHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // adiciona o token de autorização se for fornecido
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// ─── IDENTIDADE ─────────────────────────────────────────────────────────────

// realiza o login do usuário com matrícula ou CPF e senha
// retorna o token JWT e os dados do usuário autenticado
export async function login(payload: {
  matriculaProfissional?: string;
  cpf?: string;
  senha: string;
}) {
  const resposta = await fetch(`${API_URL}/identidade/login`, {
    method: 'POST',
    headers: montarHeaders(),
    body: JSON.stringify(payload),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// realiza o cadastro de um novo usuário (paciente, profissional ou admin)
// não exige autenticação pois é o registro inicial
export async function cadastrar(payload: {
  nomeCompleto: string;
  cpf: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  celular: string;
  tipo: string;
  matricula?: string;
  dataNascimento?: string;
  endereco?: string;
  responsavelNome?: string;
  responsavelContato?: string;
}) {
  const resposta = await fetch(`${API_URL}/identidade/cadastro`, {
    method: 'POST',
    headers: montarHeaders(),
    body: JSON.stringify(payload),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// lista todos os pacientes cadastrados no sistema
// requer autenticação JWT
export async function listarPacientes(token: string) {
  const resposta = await fetch(`${API_URL}/identidade/pacientes`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// lista todas as salas cadastradas no sistema
// requer autenticação JWT
export async function listarSalas(token: string) {
  const resposta = await fetch(`${API_URL}/identidade/salas`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// lista todos os profissionais cadastrados no sistema
// requer autenticação JWT
export async function listarProfissionais(token: string) {
  const resposta = await fetch(`${API_URL}/identidade/profissionais`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// ─── AGENDAMENTO ─────────────────────────────────────────────────────────────

// cria um novo agendamento com pacote de 10 sessões recorrentes
// requer autenticação JWT (profissional logado será o responsável)
export async function criarConsulta(
  payload: {
    cpfPaciente: string;
    sala: string;
    data: string;
    horario: string;
    observacao?: string;
  },
  token: string
) {
  const resposta = await fetch(`${API_URL}/agendamento/consulta`, {
    method: 'POST',
    headers: montarHeaders(token),
    body: JSON.stringify(payload),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// busca consultas com filtros opcionais de paciente, profissional e data
// requer autenticação JWT
export async function buscarConsultas(
  filtros: {
    cpfPaciente?: string;
    matriculaProfissional?: string;
    data?: string;
  },
  token: string
) {
  // monta a query string com os filtros fornecidos
  const params = new URLSearchParams();
  if (filtros.cpfPaciente) params.append('cpfPaciente', filtros.cpfPaciente);
  if (filtros.matriculaProfissional) params.append('matriculaProfissional', filtros.matriculaProfissional);
  if (filtros.data) params.append('data', filtros.data);

  const resposta = await fetch(`${API_URL}/agendamento/consulta?${params.toString()}`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// busca o histórico completo de consultas de um paciente
// requer autenticação JWT
export async function buscarHistoricoPaciente(cpfPaciente: string, token: string) {
  const resposta = await fetch(
    `${API_URL}/agendamento/consulta/historico?cpfPaciente=${cpfPaciente}`,
    {
      method: 'GET',
      headers: montarHeaders(token),
    }
  );

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// cancela uma consulta marcada para o paciente no horário informado
// requer autenticação JWT
export async function cancelarConsulta(
  payload: {
    cpfPaciente: string;
    dataConsulta: string;
    horario: string;
    observacao?: string;
  },
  token: string
) {
  const resposta = await fetch(`${API_URL}/agendamento/cancelamento`, {
    method: 'POST',
    headers: montarHeaders(token),
    body: JSON.stringify(payload),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// solicita o reagendamento de uma consulta existente
// cria uma pendência para aprovação do administrador
export async function solicitarReagendamento(
  payload: {
    consulta_id: string;
    novaData: string;
    novoHorario: string;
    motivo: string;
  },
  token: string
) {
  const resposta = await fetch(`${API_URL}/agendamento/reagendamento`, {
    method: 'POST',
    headers: montarHeaders(token),
    body: JSON.stringify(payload),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// aprova ou rejeita uma solicitação de reagendamento (apenas admin)
// atualiza o status da pendência e a consulta em caso de aprovação
export async function responderReagendamento(
  id: string,
  statusSolicitacao: 'aprovado' | 'rejeitado',
  token: string,
  motivo?: string
) {
  const params = new URLSearchParams({ id, statusSolicitacao });
  if (motivo) params.append('motivo', motivo);

  const resposta = await fetch(`${API_URL}/agendamento/reagendamento?${params.toString()}`, {
    method: 'PATCH',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// lista as solicitações de reagendamento com filtro de status
// requer autenticação de administrador
export async function listarPendenciasReagendamento(token: string, filtro?: string) {
  const params = filtro ? `?filtro=${filtro}` : '';
  const resposta = await fetch(`${API_URL}/agendamento/reagendamento/retorno${params}`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// busca todos os atendimentos do sistema para geração de relatório Excel
// exclusivo para administradores, requer autenticação JWT
export async function exportarRelatorio(token: string) {
  const resposta = await fetch(`${API_URL}/agendamento/consulta/relatorio`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// busca as estatísticas gerais do sistema para o painel do administrador
// retorna contagens de consultas, pacientes, profissionais, salas e cancelamentos
export async function buscarEstatisticasAdmin(token: string) {
  const resposta = await fetch(`${API_URL}/dashboard/stats`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// lista todas as consultas com status 'pendente' para o admin revisar
// retorna paciente, profissional, sala, data e horário de cada consulta
export async function listarAgendamentosPendentes(token: string) {
  const resposta = await fetch(`${API_URL}/agendamento/consulta/pendentes`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// aprova ou rejeita um agendamento pendente criado por estagiário
// acao: 'aprovado' transforma em 'agendada', 'rejeitado' em 'cancelada'
export async function aprovarAgendamento(id: string, acao: 'aprovado' | 'rejeitado', token: string) {
  const params = new URLSearchParams({ id, acao });
  const resposta = await fetch(`${API_URL}/agendamento/consulta/aprovar?${params.toString()}`, {
    method: 'PATCH',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// busca os dados completos de um paciente pelo CPF para o formulário de edição
// exclusivo para administradores
export async function buscarDetalhePaciente(cpf: string, token: string) {
  const params = new URLSearchParams({ cpf });
  const resposta = await fetch(`${API_URL}/identidade/paciente/detalhe?${params.toString()}`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// atualiza os dados cadastrais de um paciente (apenas admin)
// envia somente os campos que foram preenchidos
export async function editarPaciente(
  payload: { cpf: string; nome?: string; email?: string; celular?: string; endereco?: string },
  token: string
) {
  const resposta = await fetch(`${API_URL}/identidade/paciente/editar`, {
    method: 'PUT',
    headers: montarHeaders(token),
    body: JSON.stringify(payload),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// registra a presença ou ausência de um paciente na consulta
// requer autenticação JWT
export async function registrarPresenca(
  payload: {
    cpfPaciente: string;
    dataConsulta: string;
    horario: string;
    presenca: 'presente' | 'ausente';
    observacao?: string;
  },
  token: string
) {
  const resposta = await fetch(`${API_URL}/agendamento/presenca`, {
    method: 'POST',
    headers: montarHeaders(token),
    body: JSON.stringify(payload),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

// busca o perfil do profissional logado
// requer autenticação JWT
export async function buscarPerfilProfissional(token: string) {
  const resposta = await fetch(`${API_URL}/identidade/profissional/perfil`, {
    method: 'GET',
    headers: montarHeaders(token),
  });

  // retorna o corpo da resposta junto com o status HTTP
  return { status: resposta.status, dados: await resposta.json() };
}

