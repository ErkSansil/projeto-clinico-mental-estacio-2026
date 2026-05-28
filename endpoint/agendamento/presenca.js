const PRESENCA = '/agendamento/presenca';

const funcoesGerais = require('../auxiliar/funcoesGerais.js');
const servicos = require('./servicos.js');
const servicosIdentidade = require('../identidade/servicos.js');
const {autenticarToken} = require('../../middleware/auth.js');

async function validarPresenca(payload = {}) {
    const cpfPacienteNormalizado = String(payload.cpfPaciente).trim();
    const matriculaProfissionalNormalizada = String(payload.matriculaProfissional).trim();
    const camposObrigatorios = ['cpfPaciente', 'matriculaProfissional', 'dataConsulta', 'horario', 'presenca'];

    if (!['presente', 'ausente'].includes(payload.presenca)) {
        return {
            valido: false,
            status: 400,
            mensagem: 'Valor inválido para presença. Use "presente" ou "ausente".'
        };
    }

    const validacaoCampos = funcoesGerais.validarCamposObrigatorios(camposObrigatorios, payload);

    if (!validacaoCampos.valido) {
        return validacaoCampos;
    }

    const validacaoCpf = funcoesGerais.validarCpf(cpfPacienteNormalizado);

    if (!validacaoCpf.valido) {
        return validacaoCpf;
    }

    const validacaoData = funcoesGerais.validarData(payload.dataConsulta);

    if (!validacaoData.valido) {
        return validacaoData;
    }

    const validacaoHorarioFixo = funcoesGerais.validarHorarioFixo(payload.horario);

    if (!validacaoHorarioFixo.valido) {
        return validacaoHorarioFixo;
    }

    const validacaoDiaClinica = funcoesGerais.validarDiaClinica(payload.dataConsulta, payload.horario);

    if (!validacaoDiaClinica.valido) {
        return validacaoDiaClinica;
    }

    return { valido: true };
}

module.exports = (app) => {
    app.post(PRESENCA, async (req, res) => {
        try {
            const { cpfPaciente, matriculaProfissional, dataConsulta, horario, presenca, observacao} = req.body;

            const validacao = await validarPresenca({ cpfPaciente, matriculaProfissional, dataConsulta, horario, presenca, observacao });

            if (!validacao.valido) {
                return res.status(validacao.status).json({ status: validacao.status, mensagem: validacao.mensagem });
            }

            const paciente_id = await servicosIdentidade.buscarPacientePorCpf(cpfPaciente);

            if (!paciente_id || paciente_id.length === 0) {
                return res.status(404).json({ status: 404, mensagem: 'Paciente não encontrado.' });
            }

            const profissional_id = await servicosIdentidade.buscarProfissionalPorMatricula(matriculaProfissional);

            if (!profissional_id || profissional_id.length === 0) {
                return res.status(404).json({ status: 404, mensagem: 'Profissional não encontrado.' });
            }

            const consultaMarcada = await servicos.buscarConsultas({ paciente_id: paciente_id[0].id, profissional_id: profissional_id[0].id, data: dataConsulta, horario });

            if (!consultaMarcada || consultaMarcada.length === 0) {
                return res.status(404).json({ status: 404, mensagem: 'Consulta não encontrada para os dados fornecidos.' });
            }

            const dados = {
                paciente_id: paciente_id[0].id,
                consulta_id: consultaMarcada[0].id,
                presenca: presenca,
                profissional_id: profissional_id[0].id,
                observacao: observacao || null
            }

            await servicos.registrarPresenca(dados);

            res.status(200).json({ status: 200, mensagem: 'Presença registrada com sucesso.' });
        } catch (error) {
            console.error('Erro ao processar presença:', error);
            res.status(500).json({ status: 500, mensagem: error.message });
        }
    });
};