const db = require('../../db/metodosBd.js');
const conexao = require('../../db/conexao.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');

async function verificarConsultaOcupada({ salaId, data, horario }) {
	const dataFormatada = funcoesGerais.formatarData(data);

	if (!dataFormatada.valido) {
		return dataFormatada;
	}

	const consultas = await db.selecionar('consulta', ['id'], {
		sala_id: String(salaId).trim(),
		data: dataFormatada.data,
		horario: funcoesGerais.normalizarTexto(horario)
	});

	return {
		valido: true,
		ocupada: consultas.length > 0,
		data: dataFormatada.data
	};
}

function gerarDatasRecorrentes(dataInicial, quantidade = 10, intervaloSemanas = 1) {
	const dataFormatada = new Date(funcoesGerais.formatarData(dataInicial).data);

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

async function criarConsultasRecorrentes(pacienteId, profissionalId, salaId, data, horario, observacao = '', quantidade = 10, intervaloSemanas = 1) {
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
				[String(salaId).trim(), dataConsulta, funcoesGerais.normalizarTexto(horario)]
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
					String(salaId).trim(),
					dataConsulta,
					funcoesGerais.normalizarTexto(horario),
					funcoesGerais.normalizarTexto(observacao),
					'agendada'
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
	// 1. Atualizar status da consulta
	await db.atualizar('consulta', 
		{ status: 'cancelada' }, 
		{ id: consultaId }
	);

	await db.inserir('controlePresenca', {
		id: funcoesGerais.gerarNumero11Digitos(),
		paciente_id: pacienteId,
		consulta_id: consultaId,
		presente: 0,
		observacao: observacao || null,
		registrado_por: profissionalId
	});

	// 3. Contar cancelamentos
	const resultado = await contagemCancelamentos(pacienteId);

	const quantidadeCancelamentos = resultado[0].total;

	// 4. Se atingiu limite, bloquear paciente
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
	dados['presente'] = dados.presenca === 'presente' 
		? 1 
		: 0;

	
	await db.inserir('controlePresenca', {
		id: funcoesGerais.gerarNumero11Digitos(),
		paciente_id: dados.paciente_id,
		consulta_id: dados.consulta_id,
		presente: dados.presente,
		observacao: dados.observacao || null,
		registrado_por: dados.profissional_id
	});

	if (dados.presente === 0) {
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

async function contagemCancelamentos(pacienteId) {
	const resultado = await db.executarQuery(
		'SELECT COUNT(*) AS total FROM controlePresenca WHERE paciente_id = ? AND presente = ?',
		[String(pacienteId).trim(), 0]
	);
	return resultado;
}

async function buscarReagendamentoPorId(consulta_id) {
	return await db.selecionar('pendenciaConsulta', ['*'], { id: consulta_id });
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

async function buscarPendenciasReagendamento(filtro = null) {
	
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
	buscarPendenciasReagendamento
};
