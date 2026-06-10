const db = require('../../db/metodosBd.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');
const servicos = require('./servicos.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const LOGIN_PATH = '/identidade/login';
const TOKEN_SECRET = process.env.JWT_SECRET;

function normalizarPerfilToken(usuario = {}) {
    return Number(usuario.privilegio) === 1 ? 'admin' : 'profissional';
}

async function validacaoLogin(payload = {}) {
    const { senha, matriculaProfissional, cpf } = payload;

    if (!matriculaProfissional && !cpf) {
        return funcoesGerais.criarErro(400, 'Campo de identificação é obrigatório.');
    }

    const validacaoSenha = funcoesGerais.validarSenha(senha);
    if (!validacaoSenha.valido) {
        return validacaoSenha;
    }

    if (matriculaProfissional) {
        const validacaoMatricula = funcoesGerais.validarMatricula(matriculaProfissional);
        if (!validacaoMatricula.valido) {
            return validacaoMatricula;
        }
    }

    if (cpf) {
        const validacaoCpf = funcoesGerais.validarCpf(cpf);
        if (!validacaoCpf.valido) {
            return validacaoCpf;
        }
    }

    return { valido: true };
}

module.exports = (app) => {
    app.post(LOGIN_PATH, async (req, res) => {
        try {
            const { senha, matriculaProfissional, cpf } = req.body;
            const validacao = await validacaoLogin(req.body);

            if (!validacao.valido) {
                return res.status(validacao.status).json({ mensagem: validacao.mensagem });
            }

            const identificacao = matriculaProfissional 
                ? { matricula: String(matriculaProfissional).trim() } 
                : { cpf: String(cpf).trim() };

            const usuario = await servicos.buscarUsuarioPorCpfOuMatricula(identificacao);

            if (!usuario || usuario.length === 0) {
                const erro = funcoesGerais.criarErro(404, 'Usuário não encontrado.');
                return res.status(erro.status).json({ mensagem: erro.mensagem });
            }

            if (cpf && Number(usuario[0].privilegio) !== 1) {
                const erro = funcoesGerais.criarErro(403, 'Apenas administradores podem fazer login com CPF. Profissionais devem usar a matrícula.');
                return res.status(erro.status).json({ mensagem: erro.mensagem });
            }

            const senhaCorreta = await bcrypt.compare(String(senha).trim(), usuario[0].senha);

            if (!senhaCorreta) {
				const erro = funcoesGerais.criarErro(401, 'Credenciais incorretas.');
				return res.status(erro.status).json({ mensagem: erro.mensagem });
            }

            const tipoNormalizado = normalizarPerfilToken(usuario[0]);

            const token = jwt.sign(
                { id: usuario[0].id, tipo: tipoNormalizado },
                TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                status: 200,
                mensagem: 'Login bem-sucedido. Bem vindo, ' + usuario[0].nome + '!',
                token,
                usuario: {
                    id: usuario[0].id,
                    nome: usuario[0].nome,
                    email: usuario[0].email,
                    tipo: tipoNormalizado
                }
            });
        } catch (error) {
            console.error('Erro ao processar login:', error);
            res.status(500).json({ status: 500, erro: 'Erro interno ao processar login: ' + error.message });
        }
    });
}