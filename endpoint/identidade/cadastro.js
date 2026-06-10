const CADASTRO_PATH = '/identidade/cadastro';
const {autenticar, autorizar} = require('../../middleware/auth.js');

const db = require('../../db/metodosBd.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');
const servicosIdentidade = require('./servicos.js');

async function validarCadastro(payload = {}) {
	const emailNormalizado = String(payload.email).trim();
	const cpfNormalizado = String(payload.cpf).trim();
	const matriculaNormalizada = payload.matricula ? String(payload.matricula).trim() : null;

	const { senha } = payload;
	
	const tiposValidos = ['paciente', 'profissional', 'admin'];

	if (!tiposValidos.includes(String(payload.tipo).toLowerCase())) {
		return funcoesGerais.criarErro(400, `O campo tipo deve ser um dos seguintes valores: ${tiposValidos.join(', ')}.`);
	}

	let camposObrigatorios = ['nomeCompleto', 'email', 'senha', 'confirmacaoSenha', 'cpf', 'tipo', 'celular'];

	camposObrigatorios = String(payload.tipo).toLowerCase() == 'paciente' 
		? [...camposObrigatorios, 'endereco', 'dataNascimento'] 
		: [...camposObrigatorios, 'matricula'];

	const dataFormatada = funcoesGerais.formatarData(payload.dataNascimento, 'iso');
	
	const dataNascimento = new Date(dataFormatada.data + 'T00:00:00');
	const dataAtual = new Date();
	
	if (dataNascimento > dataAtual) {
		return funcoesGerais.criarErro(400, 'A data de nascimento não pode ser posterior à data atual.');
	}

	const idade = Math.floor((dataAtual - dataNascimento) / (1000 * 60 * 60 * 24 * 365.25));
	if (String(payload.tipo).toLowerCase() == 'paciente' && idade < 18) {
		camposObrigatorios = [...camposObrigatorios, 'responsavelNome', 'responsavelContato'];
	}

	const validacaoCampos = funcoesGerais.validarCamposObrigatorios(camposObrigatorios, payload);

	if (!validacaoCampos.valido) {
		return validacaoCampos;
	}

	const validacaoEmail = funcoesGerais.validarEmail(emailNormalizado);
	if (!validacaoEmail.valido) {
		return validacaoEmail;
	}

	const validacaoSenha = funcoesGerais.validarSenha(senha);
	if (!validacaoSenha.valido) {
		return validacaoSenha;
	}

	const validacaoCpf = funcoesGerais.validarCpf(cpfNormalizado);
	if (!validacaoCpf.valido) {
		return validacaoCpf;
	}

	if (matriculaNormalizada) {
		const validacaoMatricula = funcoesGerais.validarMatricula(matriculaNormalizada);

		if (!validacaoMatricula.valido) {
			return validacaoMatricula;
		}
	}

	if (String(senha).trim() !== String(payload.confirmacaoSenha).trim()){
		return funcoesGerais.criarErro(400, 'As senhas não coincidem.');
	}
	
	const duplicidade = await servicosIdentidade.verificarIdentidadeOuEmailCadastrado(cpfNormalizado, emailNormalizado, matriculaNormalizada);

	if (duplicidade.cpfCadastrado || duplicidade.emailCadastrado || duplicidade.matriculaCadastrada) {
		return funcoesGerais.criarErro(422, 'CPF, e-mail ou matrícula já cadastrados.');
	}

	return { valido: true };
}

module.exports = (app) => {
	app.post(CADASTRO_PATH, async (req, res) => {
		try {
			const { nomeCompleto, email, senha, confirmacaoSenha, matricula, cpf, celular} = req.body;

			const validacao = await validarCadastro(req.body);

			if (!validacao.valido) {
				return res.status(validacao.status).json({status: validacao.status, mensagem: validacao.mensagem });
			}

			await servicosIdentidade.cadastrarUsuario(req.body.tipo, req.body);

			res.status(201).json({ 
				sucesso: true,
				status: 200,
				mensagem: 'Cadastro realizado com sucesso.' }
			);
		} catch (error) {
			console.error('Erro ao processar cadastro:', error);
			res.status(500).json({ erro: 'Erro interno ao processar cadastro: ' + error.message });
		}
	});
	app.patch(CADASTRO_PATH, autenticar, autorizar('admin'), async (req, res) => {
		try {
			const { cpfPaciente, atividade } = req.query;

			if (!cpfPaciente) {
				return res.status(400).json({ erro: 'CPF do paciente é obrigatório para atualização.' });
			}

			const atividadesValidas = ['ativo', 'inativo', 'suspenso'];

			if (!atividadesValidas.includes(String(atividade).toLowerCase())) {
				return res.status(400).json({ erro: `O campo atividade deve ser um dos seguintes valores: ${atividadesValidas.join(', ')}.` });
			}

			const validacaoCpf = funcoesGerais.validarCpf(cpfPaciente);

			if (!validacaoCpf.valido) {
				return res.status(validacaoCpf.status).json({ erro: validacaoCpf.mensagem });
			}

			const paciente = await servicosIdentidade.buscarPacientePorCpf(cpfPaciente);

			if (!paciente || paciente.length === 0) {
				return res.status(404).json({ erro: 'Paciente não encontrado.' });
			}

			await servicosIdentidade.atualizarAtividadePaciente(paciente[0].id, atividade);

			res.status(200).json({
				sucesso: true,
				status: 200,
				mensagem: 'Atividade do paciente atualizada com sucesso.' });
		} catch (error) {
			console.error('Erro ao processar atualização de cadastro:', error);
			res.status(500).json({ erro: 'Erro interno ao processar atualização de cadastro: ' + error.message });
		}
	});

	// rota para listar todos os pacientes
	// usada pelo frontend para popular dropdowns e listas de seleção
	app.get('/identidade/pacientes', autenticar, async (req, res) => {
		try {
			const pacientes = await db.selecionar('paciente', ['id', 'cpf', 'nome', 'celular', 'email', 'ativo'], {});
			res.status(200).json({ status: 200, pacientes });
		} catch (error) {
			console.error('Erro ao listar pacientes:', error);
			res.status(500).json({ erro: 'Erro interno ao listar pacientes: ' + error.message });
		}
	});

	// rota para buscar dados completos de um paciente pelo CPF
	// usada pelo frontend para preencher o formulário de edição
	app.get('/identidade/paciente/detalhe', autenticar, autorizar('admin'), async (req, res) => {
		try {
			const { cpf } = req.query;
			if (!cpf) return res.status(400).json({ status: 400, mensagem: 'CPF é obrigatório.' });

			const validacaoCpf = funcoesGerais.validarCpf(String(cpf).trim());
			if (!validacaoCpf.valido) return res.status(400).json({ status: 400, mensagem: validacaoCpf.mensagem });

			const pacientes = await db.selecionar('paciente', ['id', 'cpf', 'nome', 'email', 'celular', 'endereco', 'dataNascimento', 'responsavelNome', 'responsavelContato', 'ativo'], { cpf: String(cpf).trim() });
			if (!pacientes || pacientes.length === 0) return res.status(404).json({ status: 404, mensagem: 'Paciente não encontrado.' });

			res.status(200).json({ status: 200, paciente: pacientes[0] });
		} catch (error) {
			console.error('Erro ao buscar paciente:', error);
			res.status(500).json({ erro: 'Erro interno: ' + error.message });
		}
	});

	// rota para editar dados cadastrais de um paciente (apenas admin)
	// permite atualizar nome, email, celular, endereço e status
	app.put('/identidade/paciente/editar', autenticar, autorizar('admin'), async (req, res) => {
		try {
			const { cpf, nome, email, celular, endereco } = req.body;

			if (!cpf) return res.status(400).json({ status: 400, mensagem: 'CPF é obrigatório.' });

			const validacaoCpf = funcoesGerais.validarCpf(String(cpf).trim());
			if (!validacaoCpf.valido) return res.status(400).json({ status: 400, mensagem: validacaoCpf.mensagem });

			const pacientes = await db.selecionar('paciente', ['id'], { cpf: String(cpf).trim() });
			if (!pacientes || pacientes.length === 0) return res.status(404).json({ status: 404, mensagem: 'Paciente não encontrado.' });

			// monta apenas os campos que foram enviados
			const dadosAtualizar = {};
			if (nome)     dadosAtualizar.nome     = String(nome).trim();
			if (email)    dadosAtualizar.email    = String(email).trim();
			if (celular)  dadosAtualizar.celular  = String(celular).trim();
			if (endereco) dadosAtualizar.endereco = String(endereco).trim();

			if (Object.keys(dadosAtualizar).length === 0) {
				return res.status(400).json({ status: 400, mensagem: 'Nenhum campo para atualizar.' });
			}

			await db.atualizar('paciente', dadosAtualizar, { id: pacientes[0].id });

			res.status(200).json({ status: 200, mensagem: 'Paciente atualizado com sucesso.' });
		} catch (error) {
			console.error('Erro ao editar paciente:', error);
			res.status(500).json({ erro: 'Erro interno: ' + error.message });
		}
	});

	// rota para listar todas as salas cadastradas
	// usada pelo frontend para popular o dropdown de seleção de sala
	app.get('/identidade/salas', autenticar, async (req, res) => {
		try {
			const salas = await db.selecionar('sala', ['id', 'descricao'], {});
			res.status(200).json({ status: 200, salas });
		} catch (error) {
			console.error('Erro ao listar salas:', error);
			res.status(500).json({ erro: 'Erro interno ao listar salas: ' + error.message });
		}
	});

	// rota para listar todos os profissionais cadastrados
	// usada pelo frontend para popular o dropdown de seleção de estagiário
	app.get('/identidade/profissionais', autenticar, async (req, res) => {
		try {
			const profissionais = await db.selecionar('profissional', ['id', 'nome', 'matricula', 'email'], {});
			res.status(200).json({ status: 200, profissionais });
		} catch (error) {
			console.error('Erro ao listar profissionais:', error);
			res.status(500).json({ erro: 'Erro interno ao listar profissionais: ' + error.message });
		}
	});
};
