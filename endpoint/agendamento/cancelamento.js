const CANCELAMENTO = '/agendamento/cancelamento';

const funcoesGerais = require('../auxiliar/funcoesGerais.js');
const servicos = require('./servicos.js');
const servicosIdentidade = require('../identidade/servicos.js');
const { autenticar, autorizar } = require('../../middleware/auth.js');

async function validarCancelamento(payload = {}) {
    const cpfPacienteNormalizado = String(payload.cpfPaciente).trim();
    const matriculaProfissionalNormalizada = String(payload.matriculaProfissional).trim();
    const camposObrigatorios = ['cpfPaciente', 'matriculaProfissional', 'dataConsulta', 'horario'];

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
    app.post(CANCELAMENTO, async (req, res) => {
        try {
            const { cpfPaciente, matriculaProfissional, dataConsulta, horario, observacao } = req.body;

            const validacao = await validarCancelamento({ cpfPaciente, matriculaProfissional, dataConsulta, horario });

            if (!validacao.valido) {
                return res.status(validacao.status).json({ mensagem: validacao.mensagem });
            }

            const paciente_id = await servicosIdentidade.buscarPacientePorCpf(cpfPaciente);

            if (!paciente_id || paciente_id.length === 0) {
                return res.status(404).json({ mensagem: 'Paciente não encontrado.' });
            }

            const atividadePaciente = await servicosIdentidade.verificarAtividadePaciente(paciente_id[0].id);

            if (!atividadePaciente.valido) {
                return res.status(atividadePaciente.status).json({ mensagem: atividadePaciente.mensagem });
            }

            const profissional_id = await servicosIdentidade.buscarProfissionalPorMatricula(matriculaProfissional);
            if (!profissional_id || profissional_id.length === 0) {
                return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
            }

            const dataFormatada = funcoesGerais.formatarData(dataConsulta);
            const filtros = {
                paciente_id: paciente_id[0].id,
                profissional_id: profissional_id[0].id,
                data: dataFormatada.data,
                horario: horario
            };

            const consulta = await servicos.buscarConsultas(filtros);
            if (!consulta || consulta.length === 0) {
                return res.status(404).json({ mensagem: 'Consulta não encontrada para os dados fornecidos.' });
            }

            const resultado = await servicos.cancelarConsulta(
                paciente_id[0].id,
                consulta[0].id,
                profissional_id[0].id,
                observacao
            );

            if (resultado.bloqueado) {
                return res.status(200).json({
                    status: 200,
                    mensagem: `Consulta cancelada com sucesso. O paciente foi suspenso devido a ${resultado.quantidadeCancelamentos} cancelamentos.`
                });
            }

            res.status(200).json({
                status: 200,
                mensagem: `Consulta cancelada com sucesso. Total de cancelamentos: ${resultado.quantidadeCancelamentos}/3.`
            });
            
        } catch (error) {
            console.error('Erro ao processar cancelamento:', error);
            res.status(500).json({ status: 500, mensagem: error.message });
        }
    });
};