const db = require('../../db/metodosBd.js');
const conexao = require('../../db/conexao.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');

async function verificarConsultaOcupada({ sala_id, data, horario }) {
	const consultas = await db.selecionar('consulta', ['id'], {
		sala_id: String(sala_id).trim(),
		data: data,
		horario: horario + ':00'
	});

	if (consultas.length > 0) {
		return {
			valido: false,
			status: 400,
			mensagem: 'A consulta não está disponível para o horário e sala informados.'
		}
	}

	return { valido: true };
}

function gerarDatasRecorrentes(dataInicial, quantidade = 10, intervaloSemanas = 1) {
	const dataFormatada = new Date(funcoesGerais.formatarData(dataInicial, 'iso').data);

	if (Number.isNaN(dataFormatada.getTime())) {
		return {
			valido: false,
			status: 400,
			mensagem: 'Formato de data invalido.'
		};
	}

	const datas = [];

	for (let indice = 0; indice < quantidade; indice += 1) {
		const dataConsulta = new Date(dataFormatada);
		dataConsulta.setDate(dataConsulta.getDate() + (indice * intervaloSemanas * 7));
		datas.push(dataConsulta.toISOString().split('T')[0]);
	}

	return {
		valido: true,
		datas
	};
}

// statusInicial permite que o admin crie consultas já como 'agendada'
// enquanto o estagiário cria como 'pendente' aguardando aprovação do admin
async function criarConsultasRecorrentes(pacienteId, profissionalId, sala_id, data, horario, observacao = '', quantidade = 10, intervaloSemanas = 1, statusInicial = 'agendada') {
	const datasGeradas = gerarDatasRecorrentes(data, quantidade, intervaloSemanas);

	if (!datasGeradas.valido) {
		return datasGeradas;
	}

	const conexaoAtiva = await conexao.getConnection();

	try {
		await conexaoAtiva.beginTransaction();

		for (const dataConsulta of datasGeradas.datas) {
			const [consultaExistente] = await conexaoAtiva.execute(
				'SELECT id FROM consulta WHERE sala_id = ? AND data = ? AND horario = ?',
				[String(sala_id).trim(), dataConsulta, funcoesGerais.normalizarTexto(horario)]
			);

			if (consultaExistente.length > 0) {
				throw new Error(`Sala já ocupada na data ${dataConsulta} no horário informado.`);
			}

			await conexaoAtiva.execute(
				'INSERT INTO consulta (id, paciente_id, profissional_id, sala_id, data, horario, observacao, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
				[
					funcoesGerais.gerarNumero11Digitos(),
					String(pacienteId).trim(),
					String(profissionalId).trim(),
					String(sala_id).trim(),
					dataConsulta,
					funcoesGerais.normalizarTexto(horario),
					funcoesGerais.normalizarTexto(observacao),
					// usa o status recebido — 'pendente' para estagiário, 'agendada' para admin
					statusInicial
				]
			);
		}

		await conexaoAtiva.commit();

		return {
			valido: true,
			quantidadeCriada: datasGeradas.datas.length,
			datas: datasGeradas.datas
		};
	} catch (error) {
		await conexaoAtiva.rollback();
		return {
			valido: false,
			status: 422,
			mensagem: error.message
		};
	} finally {
		conexaoAtiva.release();
	}
}

async function buscarConsultas(filtros) {
	const camposPermitidos = ['paciente_id', 'profissional_id', 'sala_id', 'data', 'horario', 'status'];
	const condicoesBusca = [];
	const valores = [];

	if (filtros.data) {
		filtros.data = funcoesGerais.formatarData(filtros.data, 'iso').data;
	}
	
	if (filtros.horario) {
		filtros.horario = filtros.horario + ':00';
	}

	for (const [campo, valor] of Object.entries(filtros)) {
		if (valor && camposPermitidos.includes(campo)) {
			condicoesBusca.push(`${campo} = ?`);
			valores.push(String(valor).trim());
		}
	}

	const consultaSQL = `
		SELECT 
			c.id, 
			c.data, 
			c.horario, 
			c.observacao, 
			c.status,
			p.nome AS pacienteNome,
			pr.nome AS profissionalNome,
			s.descricao AS sala
		FROM consulta c
		LEFT JOIN paciente p ON c.paciente_id = p.id
		LEFT JOIN profissional pr ON c.profissional_id = pr.id
		LEFT JOIN sala s ON c.sala_id = s.id
		WHERE ${condicoesBusca.join(' AND ')}
		ORDER BY c.data, c.horario ASC
	`;

	const consultas = await db.executarQuery(consultaSQL, valores);
	return consultas;
}

async function reagendarConsulta(dados) {
	if (!dados || Object.keys(dados).length === 0) {
		return funcoesGerais.criarErro(400, 'Dados para reagendamento são obrigatórios.');
	}

	await db.inserir('pendenciaConsulta', dados);

	return {
		valido: true,
		status: 200,
		mensagem: 'Solicitação de reagendamento criada com sucesso. Entre em contato com o administrador para aprovação.'
	};
}

async function cancelarConsulta(pacienteId, consultaId, profissionalId, observacao = null) {
	await db.atualizar('consulta', 
		{ status: 'cancelada' }, 
		{ id: consultaId }
	);

	const resultado = await contagemCancelamentos(pacienteId);

	const quantidadeCancelamentos = resultado[0].total;

	if (quantidadeCancelamentos >= 3) {
		await db.atualizar('paciente', 
			{ ativo: 0 }, 
			{ id: pacienteId }
		);

        return {
            sucesso: true,
            mensagem: `Consulta cancelada com sucesso. O paciente foi bloqueado devido a ${quantidadeCancelamentos} cancelamentos.`,
            bloqueado: true
        };
	}

	return {
		sucesso: true,
		quantidadeCancelamentos,
		bloqueado: quantidadeCancelamentos >= 3
	};
}

async function registrarPresenca(dados) {
	dados['presenca'] = dados.presenca === 'presente' 
		? 1 
		: 0;

	
	await db.inserir('controlePresenca', {
		id: funcoesGerais.gerarNumero11Digitos(),
		paciente_id: dados.paciente_id,
		consulta_id: dados.consulta_id,
		presente: dados.presenca,
		observacao: dados.observacao || null,
		registrado_por: dados.profissional_id
	});

	if (dados.presenca === 0) {
		const resultado = await cancelarConsulta(dados.paciente_id, dados.consulta_id, dados.profissional_id, 'paciente ausente');
		return {
			sucesso: true,
			mensagem: 'Presença registrada como ausente. ' + (resultado.bloqueado ? 'Paciente bloqueado devido a cancelamentos.' : `Total de cancelamentos: ${resultado.quantidadeCancelamentos}.`),
			bloqueado: resultado.bloqueado
		};
	}

	await db.atualizar('consulta', 
		{ status: 'concluida' }, 
		{ id: dados.consulta_id }
	);

	return {
		sucesso: true,
		mensagem: 'Presença registrada como presente.'
	};
}

async function contagemCancelamentos(paciente_id) {
	const resultado = await db.executarQuery(
 		`SELECT COUNT(DISTINCT consulta_id) AS total
 		 FROM (
 			 SELECT id AS consulta_id FROM consulta WHERE paciente_id = ? AND status = 'cancelada'
 			 UNION
 			 SELECT consulta_id FROM controlePresenca WHERE paciente_id = ? AND presente = 0
 		 ) cancelamentos`,
		[String(paciente_id).trim(), String(paciente_id).trim()]
	);
	return resultado;
}

async function buscarReagendamentoPorId(id) {
	return await db.selecionar('pendenciaConsulta', ['*'], { id: id });
}

async function atualizarStatusReagendamento(id, status, motivo = null, aprovadoUsuario_id) {
	await db.atualizar('pendenciaConsulta', { 
		statusSolicitacao: status, 
		motivo: motivo,
		aprovadoUsuario_id: aprovadoUsuario_id 
	}, { id });
}

async function atualizarConsulta(consulta_id, dados) {
	await db.atualizar('consulta', dados, { id: consulta_id });
}

async function buscarPendenciasReagendamento(filtro = 'pendente') {
	
    if (!filtro) {
        return await db.selecionar('pendenciaConsulta', ['*']);
    }

    const filtrosValidos = ['aprovado', 'rejeitado', 'pendente'];
    const filtroNormalizado = String(filtro).trim().toLowerCase();

    if (!filtrosValidos.includes(filtroNormalizado)) {
        return funcoesGerais.criarErro(400, 'Filtro inválido. Os valores permitidos são: "aprovado", "rejeitado", "pendente"');
    }

    return await db.selecionar('pendenciaConsulta', ['*'], { statusSolicitacao: filtroNormalizado });
}

async function buscarConsultaPorId(consulta_id) {
	return await db.selecionar('consulta', ['*'], { id: consulta_id });
}

async function buscarConsultasPendentes() {
	const sql = `
                SELECT
                    c.id,
                    c.data,
                    c.horario,
                    c.observacao,
                    c.status,
                    p.nome  AS pacienteNome,
                    p.cpf   AS pacienteCpf,
                    pr.nome AS profissionalNome,
                    pr.matricula AS profissionalMatricula,
                    s.descricao  AS sala
                FROM consulta c
                LEFT JOIN paciente     p  ON c.paciente_id     = p.id
                LEFT JOIN profissional pr ON c.profissional_id = pr.id
                LEFT JOIN sala         s  ON c.sala_id         = s.id
                WHERE c.status = 'pendente'
                ORDER BY c.data ASC, c.horario ASC
            `;
	return await db.executarQuery(sql, []);
}

async function buscarConsultasRelatorio(filtros) {
	// todos os agendamentos com presença, profissional, paciente e sala
	const sqlAtendimentos = `
                SELECT
                    c.id AS consulta_id,
                    p.nome AS paciente,
                    p.cpf AS cpf_paciente,
                    pr.nome AS profissional,
                    pr.matricula AS matricula_profissional,
                    s.descricao AS sala,
                    c.data,
                    c.horario,
                    c.status,
                    c.observacao,
                    CASE WHEN cp.presente = 1 THEN 'Presente'
                         WHEN cp.presente = 0 THEN 'Ausente'
                         ELSE 'Não registrado'
                    END AS presenca
                FROM consulta c
                LEFT JOIN paciente p ON c.paciente_id = p.id
                LEFT JOIN profissional pr ON c.profissional_id = pr.id
                LEFT JOIN sala s ON c.sala_id = s.id
                LEFT JOIN controlePresenca cp ON c.id = cp.consulta_id
                ORDER BY c.data DESC, c.horario DESC
            `;

	// consultas com status cancelada trazendo quem cancelou
	const sqlCancelamentos = `
                SELECT
                    c.id AS consulta_id,
                    p.nome AS paciente,
                    p.cpf AS cpf_paciente,
                    pr.nome AS profissional,
                    pr.matricula AS matricula_profissional,
                    s.descricao AS sala,
                    c.data,
                    c.horario,
                    c.observacao AS motivo_cancelamento
                FROM consulta c
                LEFT JOIN paciente p ON c.paciente_id = p.id
                LEFT JOIN profissional pr ON c.profissional_id = pr.id
                LEFT JOIN sala s ON c.sala_id = s.id
                WHERE c.status = 'cancelada'
                ORDER BY c.data DESC, c.horario DESC
            `;

	// todas as solicitações de reagendamento com dados da consulta original
	const sqlReagendamentos = `
                SELECT
                    pc.id AS solicitacao_id,
                    c.id AS consulta_id,
                    p.nome AS paciente,
                    p.cpf AS cpf_paciente,
                    pr.nome AS profissional,
                    pr.matricula AS matricula_profissional,
                    s.descricao AS sala,
                    c.data AS data_original,
                    c.horario AS horario_original,
                    pc.novaData AS nova_data,
                    pc.novoHorario AS novo_horario,
                    pc.motivo,
                    pc.statusSolicitacao AS status_solicitacao
                FROM pendenciaConsulta pc
                LEFT JOIN consulta c ON pc.consulta_id = c.id
                LEFT JOIN paciente p ON c.paciente_id = p.id
                LEFT JOIN profissional pr ON c.profissional_id = pr.id
                LEFT JOIN sala s ON c.sala_id = s.id
                ORDER BY pc.id DESC
            `;

	return [atendimentos, cancelamentos, reagendamentos] = await Promise.all([
		db.executarQuery(sqlAtendimentos, []),
		db.executarQuery(sqlCancelamentos, []),
		db.executarQuery(sqlReagendamentos, []),
	]);
}

module.exports = {
	verificarConsultaOcupada,
	gerarDatasRecorrentes,
	criarConsultasRecorrentes,
	buscarConsultas,
	reagendarConsulta,
	cancelarConsulta,
	registrarPresenca,
	buscarReagendamentoPorId,
	atualizarStatusReagendamento,
	atualizarConsulta,
	buscarPendenciasReagendamento,
	buscarConsultaPorId,
	buscarConsultasPendentes
};
