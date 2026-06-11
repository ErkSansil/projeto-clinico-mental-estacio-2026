const db = require('../../db/metodosBd.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');

async function verificarIdentidadeOuEmailCadastrado(cpf, email, matricula) {
	const [cpfPaciente, emailPaciente, cpfProfissional, emailProfissional, matriculaProfissional] = await Promise.all([
		db.selecionar('paciente', ['id'], { cpf: cpf }),
		db.selecionar('paciente', ['id'], { email: email }),
		db.selecionar('profissional', ['id'], { cpf: cpf }),
        db.selecionar('profissional', ['id'], { email: email }),
		db.selecionar('profissional', ['id'], { matricula: matricula })
	]);

	return {
		cpfCadastrado: cpfPaciente.length > 0 || cpfProfissional.length > 0,
		emailCadastrado: emailPaciente.length > 0 || emailProfissional.length > 0,
		matriculaCadastrada: matriculaProfissional.length > 0
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

async function buscarSalaPorNumero(id) {
	return db.selecionar('sala', ['id'], { id });
}

async function buscarProfissionalPorId(id) {
    const profissional = await db.selecionar('profissional', ['id', 'nome', 'email', 'cpf', 'celular', 'matricula', 'privilegio'], { id });
    return profissional[0] || null;
}

async function atualizarAtividadePaciente(paciente_id, atividade) {
	const valorAtividade = atividade === 'ativo' ? 1 : 0;
	return db.atualizar('paciente', {'ativo': valorAtividade }, { id: paciente_id });
}

async function verificarAtividadePaciente(paciente_id) {
    const paciente = await db.selecionar('paciente', ['ativo'], { id: paciente_id });
    if (!paciente || paciente.length === 0) {
        return { status: 404, valido: false, mensagem: 'Paciente não encontrado.' };
    }
    if (Number(paciente[0].ativo) !== 1) {
        return { status: 422, valido: false, mensagem: 'Paciente está bloqueado ou suspenso. Contate o administrador.' };
    }
    return { valido: true };
}

async function cadastrarUsuario(tipo, dados) {
    if (String(tipo).toLowerCase() === 'profissional' || String(tipo).toLowerCase() === 'admin') {
        await db.inserir('profissional', {
            id: funcoesGerais.gerarNumero11Digitos(),
            cpf: dados.cpf,
            nome: dados.nomeCompleto,
            email: dados.email,
            senha: funcoesGerais.gerarHashSenha(dados.senha),
            celular: dados.celular,
            matricula: dados.matricula,
            privilegio: String(dados.tipo).toLowerCase() === 'admin' ? 1 : 0
        });
    } else {
        await db.inserir('paciente', {
            id: funcoesGerais.gerarNumero11Digitos(),
            cpf: dados.cpf,
            nome: dados.nomeCompleto,
            email: dados.email,
            senha: funcoesGerais.gerarHashSenha(dados.senha),
            celular: dados.celular,
            endereco: dados.endereco,
            dataNascimento: funcoesGerais.formatarData(dados.dataNascimento, 'iso').data,
            responsavelNome: dados.responsavelNome || null,
            responsavelContato: dados.responsavelContato || null,
            ativo: 1
        });
    }
}

async function buscarHistoricoPaciente(paciente_id) {
    const sqlHistorico = `
        SELECT 
            c.id,
            c.data,
            c.horario,
            c.observacao,
            c.status,
            pr.nome AS profissionalNome,
            s.descricao AS sala,
            COALESCE(cp.presente, 'Consulta futura') AS presente,
            COALESCE(cp.observacao, 'Nenhuma observação') AS observacaoPresenca
        FROM consulta c
        LEFT JOIN profissional pr ON c.profissional_id = pr.id
        LEFT JOIN sala s ON c.sala_id = s.id
        LEFT JOIN controlePresenca cp ON c.id = cp.consulta_id
        WHERE c.paciente_id = ?
        ORDER BY c.data DESC, c.horario DESC
    `;
    
    return db.executarQuery(sqlHistorico, [String(paciente_id).trim()]);
}

module.exports = {
	verificarIdentidadeOuEmailCadastrado,
	buscarUsuarioPorCpfOuMatricula,
	buscarPacientePorCpf,
	buscarProfissionalPorMatricula,
	buscarSalaPorNumero,
	atualizarAtividadePaciente,
	verificarAtividadePaciente,
	buscarHistoricoPaciente,
    cadastrarUsuario,
    buscarProfissionalPorId
};
