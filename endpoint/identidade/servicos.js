const db = require('../../db/metodosBd.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');

async function verificarCpfOuEmailCadastrado(cpf, email) {
	const cpfNormalizado = funcoesGerais.normalizarTexto(cpf);
	const emailNormalizado = funcoesGerais.normalizarTexto(email);

	const [cpfPaciente, cpfProfissional, emailPaciente, emailProfissional] = await Promise.all([
		db.selecionar('paciente', ['id'], { cpf: cpfNormalizado }),
		db.selecionar('profissional', ['id'], { cpf: cpfNormalizado }),
		db.selecionar('paciente', ['id'], { email: emailNormalizado }),
		db.selecionar('profissional', ['id'], { email: emailNormalizado })
	]);

	return {
		cpfCadastrado: cpfPaciente.length > 0 || cpfProfissional.length > 0,
		emailCadastrado: emailPaciente.length > 0 || emailProfissional.length > 0
	};
}

async function buscarUsuarioPorCpfOuMatricula(identificacao) {
    const { cpf, matricula } = identificacao;

    if (matricula) {
        return await db.selecionar('profissional', ['id', 'nome', 'email', 'cpf', 'senha', 'privilegio'], { matricula });
    } else if (cpf) {
        return await db.selecionar('profissional', ['id', 'nome', 'email', 'cpf', 'senha', 'privilegio'], { cpf });
    }

    return null;
}

async function buscarPacientePorCpf(cpf) {
	return db.selecionar('paciente', ['id'], { cpf: funcoesGerais.normalizarTexto(cpf) });
}

async function buscarProfissionalPorMatricula(matricula) {
	return db.selecionar('profissional', ['id'], { matricula: funcoesGerais.normalizarTexto(matricula) });
}

async function buscarSalaPorNumero(descricao) {
	return db.selecionar('sala', ['id'], { descricao: funcoesGerais.normalizarTexto(descricao) });
}

async function atualizarAtividadePaciente(pacienteId, atividade) {
	const valorAtividade = atividade === 'ativo' ? 1 : 0;
	return db.atualizar('paciente', {'ativo': valorAtividade }, { id: pacienteId });
}

async function verificarAtividadePaciente(pacienteId) {
    const paciente = await db.selecionar('paciente', ['ativo'], { id: pacienteId });
    if (!paciente || paciente.length === 0) {
        return { valido: false, mensagem: 'Paciente não encontrado.' };
    }
    if (Number(paciente[0].ativo) !== 1) {
        return { valido: false, mensagem: 'Paciente está bloqueado ou suspenso. Contate o administrador.' };
    }
    return { valido: true };
}

async function buscarHistoricoPaciente(pacienteId) {
    const sqlHistorico = `
        SELECT 
            c.id,
            c.data,
            c.horario,
            c.observacao,
            c.status,
            pr.nome AS profissionalNome,
            s.descricao AS sala,
            cp.presente,
            cp.observacao AS observacaoPresenca
        FROM consulta c
        LEFT JOIN profissional pr ON c.profissional_id = pr.id
        LEFT JOIN sala s ON c.sala_id = s.id
        LEFT JOIN controlePresenca cp ON c.id = cp.consulta_id
        WHERE c.paciente_id = ?
        ORDER BY c.data DESC, c.horario DESC
    `;
    
    return db.executarQuery(sqlHistorico, [String(pacienteId).trim()]);
}

module.exports = {
	verificarCpfOuEmailCadastrado,
	buscarUsuarioPorCpfOuMatricula,
	buscarPacientePorCpf,
	buscarProfissionalPorMatricula,
	buscarSalaPorNumero,
	atualizarAtividadePaciente,
	verificarAtividadePaciente,
	buscarHistoricoPaciente
};
