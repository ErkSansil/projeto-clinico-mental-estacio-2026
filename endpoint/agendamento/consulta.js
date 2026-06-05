const CONSULTA = '/agendamento/consulta';
const {autenticar} = require('../../middleware/auth.js');

const db = require('../../db/metodosBd.js');
const conexao = require('../../db/conexao.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');
const servicos = require('./servicos.js');
const servicosIdentidade = require('../identidade/servicos.js');

async function validarConsulta(payload = {}) {
    const cpfPacienteNormalizado = String(payload.cpfPaciente).trim();

    const camposObrigatorios = ['cpfPaciente', 'sala', 'data', 'horario'];

    const validacaoCampos = funcoesGerais.validarCamposObrigatorios(camposObrigatorios, payload);
    const validacaoCpf = funcoesGerais.validarCpf(cpfPacienteNormalizado);
    const validacaoData = funcoesGerais.validarData(payload.data);
    const validacaoHorarioFixo = funcoesGerais.validarHorarioFixo(payload.horario);
    const validacaoDiaClinica = funcoesGerais.validarDiaClinica(payload.data, payload.horario);

    if (!validacaoCampos.valido) {
        return { valido: false, status: validacaoCampos.status, mensagem: validacaoCampos.mensagem };
    }
    
    if (!validacaoCpf.valido) {
        return { valido: false, status: validacaoCpf.status, mensagem: validacaoCpf.mensagem };
    }

    if (!validacaoData.valido) {
        return { valido: false, status: validacaoData.status, mensagem: validacaoData.mensagem };
    }

    if (!validacaoHorarioFixo.valido) {
        return { valido: false, status: validacaoHorarioFixo.status, mensagem: validacaoHorarioFixo.mensagem };
    }

    if (!validacaoDiaClinica.valido) {
        return { valido: false, status: validacaoDiaClinica.status, mensagem: validacaoDiaClinica.mensagem };
    }

    return { valido: true };
}

module.exports = (app) => {
    app.post(CONSULTA, autenticar, async (req, res) => {
        try {
            const { cpfPaciente, sala, data, horario, observacao } = req.body;

            const usuarioLogado = req.usuario;

            const validacaoCampos = await validarConsulta(req.body);

            if (!validacaoCampos.valido) {
                return res.status(validacaoCampos.status).json({ mensagem: validacaoCampos.mensagem });
            }
            
            const paciente_id = await servicosIdentidade.buscarPacientePorCpf(cpfPaciente);

            if (!paciente_id || paciente_id.length === 0) {
                const erro = funcoesGerais.criarErro(404, 'Paciente não encontrado.');
                return res.status(erro.status).json({ status: erro.status, mensagem: erro.mensagem });
            }

            const atividadePaciente = await servicosIdentidade.verificarAtividadePaciente(paciente_id[0].id);

            if (!atividadePaciente.valido) {
                return res.status(atividadePaciente.status).json({ status: atividadePaciente.status, mensagem: atividadePaciente.mensagem });
            }

            const sala_id = await servicosIdentidade.buscarSalaPorNumero(sala);

            if (!sala_id || sala_id.length === 0) {
                const erro = funcoesGerais.criarErro(404, 'Sala não encontrada.');
                return res.status(erro.status).json({ status: erro.status, mensagem: erro.mensagem });
            }

            const dataFormatada = funcoesGerais.formatarData(data, 'iso').data;

            const verificacaoConsulta = await servicos.verificarConsultaOcupada({
                sala_id: sala_id[0].id,
                data: dataFormatada,
                horario
            });

            if (!verificacaoConsulta.valido) {
                return res.status(verificacaoConsulta.status).json({ status: verificacaoConsulta.status, mensagem: verificacaoConsulta.mensagem });
            }

            if (verificacaoConsulta.ocupada) {
                const erro = funcoesGerais.criarErro(422, 'Sala já ocupada nesse horário. Por favor, selecione outro.');
                return res.status(erro.status).json({ status: erro.status, mensagem: erro.mensagem });
            }

            const criacaoConsultas = await servicos.criarConsultasRecorrentes(
                paciente_id[0].id,
                usuarioLogado.id,
                sala_id[0].id,
                data,
                horario,
                observacao,
                10,
                1
            );

            if (!criacaoConsultas.valido) {
                return res.status(criacaoConsultas.status).json({ status: criacaoConsultas.status, mensagem: criacaoConsultas.mensagem });
            }
        
            const datasFormatadas = criacaoConsultas.datas.map(data => funcoesGerais.formatarData(data).data);

            res.status(201).json({
                mensagem: 'Consultas criadas com sucesso para a data definida e para as próximas 10 semanas subsequentes.',
                quantidadeCriada: criacaoConsultas.quantidadeCriada,
                datas: datasFormatadas
            });

        } catch (error) {
            res.status(500).json({ status: 500, mensagem: 'Ocorreu um erro ao processar a consulta.' + ' Detalhes: ' + error.message });
        }
    });

    app.get(CONSULTA, autenticar, async (req, res) => {
        try {
            const { cpfPaciente, matriculaProfissional, data } = req.query;

            if (!cpfPaciente && !matriculaProfissional && !data) {
                return res.status(400).json({ status: 400, mensagem: 'Pelo menos um filtro (cpfPaciente, matriculaProfissional ou data) deve ser fornecido.' });
            }

            const usuarioLogado = req.usuario;

            const filtros = {};

            if (cpfPaciente) {
                const paciente_id = await servicosIdentidade.buscarPacientePorCpf(cpfPaciente);
                if (!paciente_id || paciente_id.length === 0) {
                    return res.status(404).json({ status: 404, mensagem: 'Paciente não encontrado.' });
                }
                filtros.paciente_id = paciente_id[0].id;
            }

            if (matriculaProfissional) {
                filtros.profissional_id = usuarioLogado.id;
            }

            if (data) {
                const dataFormatada = funcoesGerais.formatarData(data);
                if (!dataFormatada.valido) {
                    return res.status(dataFormatada.status).json({ status: dataFormatada.status, mensagem: dataFormatada.mensagem });
                }
                filtros.data = dataFormatada.data;
            }

            return res.status(200).json(await servicos.buscarConsultas(filtros));
        } catch (error) {
            res.status(500).json({ status: 500, mensagem: 'Ocorreu um erro ao buscar as consultas.' + 'Detalhes: ' + error.message });
        }
    });
    app.get(CONSULTA + '/historico', autenticar, async (req, res) => {
        try {
            const { cpfPaciente } = req.query;

            if (!cpfPaciente) {
                return res.status(400).json({ status: 400, mensagem: 'CPF do paciente é obrigatório.' });
            }

            const paciente_id = await servicosIdentidade.buscarPacientePorCpf(cpfPaciente);

            if (!paciente_id || paciente_id.length === 0) {
                return res.status(404).json({ status: 404, mensagem: 'Paciente não encontrado.' });
            }

            const historico = await servicosIdentidade.buscarHistoricoPaciente(paciente_id[0].id);
            res.status(200).json({ status: 200, historico });
        } catch (error) {
            res.status(500).json({ status: 500, mensagem: 'Ocorreu um erro ao buscar o histórico do paciente.' + 'Detalhes: ' + error.message });
        }
    });
};