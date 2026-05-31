const REAGENDAMENTO = '/agendamento/reagendamento';
const {autenticar, autorizar} = require('../../middleware/auth.js');

const db = require('../../db/metodosBd.js');
const conexao = require('../../db/conexao.js');
const funcoesGerais = require('../auxiliar/funcoesGerais.js');
const servicos = require('./servicos.js');
const servicosIdentidade = require('../identidade/servicos.js');
const consulta = require('./consulta.js');

module.exports = (app) => {
    app.post(REAGENDAMENTO, autenticar, async (req, res) => {
        try {
            const { consulta_id, novaData, novoHorario, motivo } = req.body;

            const usuarioLogado = req.usuario;

            const camposObrigatorios = ['consulta_id', 'novaData', 'novoHorario', 'motivo'];
            const validacaoCampos = funcoesGerais.validarCamposObrigatorios(camposObrigatorios, req.body);

            if (!validacaoCampos.valido) {
                return res.status(validacaoCampos.status).json({ mensagem: validacaoCampos.mensagem });
            }

            const dataFormatada = funcoesGerais.formatarData(novaData, 'iso').data;

            if (!dataFormatada) {
                return res.status(dataFormatada.status).json({ mensagem: dataFormatada.mensagem });
            }

            const validacaoHorarioFixo = funcoesGerais.validarHorarioFixo(novoHorario);

            if (!validacaoHorarioFixo.valido) {
                return res.status(validacaoHorarioFixo.status).json({ mensagem: validacaoHorarioFixo.mensagem });
            }

            const validacaoDiaClinica = funcoesGerais.validarDiaClinica(novaData, novoHorario);

            if (!validacaoDiaClinica.valido) {
                return res.status(validacaoDiaClinica.status).json({ mensagem: validacaoDiaClinica.mensagem });
            }

            const consultaMarcada = await servicos.buscarConsultaPorId(consulta_id);
            
            if (!consultaMarcada || consultaMarcada.length === 0) {
                const erro = funcoesGerais.criarErro(404, 'Consulta não encontrada.');
                return res.status(erro.status).json({ mensagem: erro.mensagem });
            }

            const atividadePaciente = await servicosIdentidade.verificarAtividadePaciente(consultaMarcada[0].paciente_id);

            if (!atividadePaciente.valido) {
                return res.status(atividadePaciente.status).json({ mensagem: atividadePaciente.mensagem });
            }

            const verificarOcupacao = await servicos.verificarConsultaOcupada({
                sala_id: consultaMarcada[0].sala_id,
                data: dataFormatada,
                horario: novoHorario
            });

            if (!verificarOcupacao.valido) {
                const erro = funcoesGerais.criarErro(verificarOcupacao.status, verificarOcupacao.mensagem);
                return res.status(erro.status).json({status: erro.status, mensagem: erro.mensagem });
            }

            const dados = {
                id: funcoesGerais.gerarNumero11Digitos(),
                consulta_id: consultaMarcada[0].id,
                cadastroUsuario_id: usuarioLogado.id,
                novaData: dataFormatada,
                novoHorario: novoHorario,
                motivo: motivo,
                statusSolicitacao: 'pendente',
            }

           const reagendamento = await servicos.reagendarConsulta(dados);

            if (!reagendamento.valido) {
                return res.status(reagendamento.status).json({ mensagem: reagendamento.mensagem });
            }

            res.status(200).json({ status: 200, mensagem: reagendamento.mensagem });

        } catch (error) {
            const erro = funcoesGerais.criarErro(500, 'Ocorreu um erro ao atualizar a consulta.');
            res.status(erro.status).json({ mensagem: erro.mensagem + 'Detalhes: ' + error.message });
        }
    });
    app.put(REAGENDAMENTO, autenticar, autorizar('admin'), async (req, res) => {
        try {
            const { id, statusSolicitacao, motivo } = req.query;

            const usuarioId = req.usuario.id;

            const validarCampos = funcoesGerais.validarCamposObrigatorios(['id', 'statusSolicitacao'], req.query);

            if (!validarCampos.valido) {
                return res.status(validarCampos.status).json({ 
                    status: validarCampos.status, 
                    mensagem: validarCampos.mensagem 
                });
            }

            const statusNormalizado = String(statusSolicitacao).trim().toLowerCase();

            if (!['aprovado', 'rejeitado'].includes(statusNormalizado)) {
                return res.status(400).json({ 
                    status: 400, 
                    mensagem: 'Status de solicitação inválido. Deve ser "aprovado" ou "rejeitado".' 
                });
            }

            const reagendamento = await servicos.buscarReagendamentoPorId(id);

            if (!reagendamento || reagendamento.length === 0) {
                return res.status(404).json({ 
                    status: 404, 
                    mensagem: 'Solicitação de reagendamento não encontrada.' 
                });
            }

            const consultaMarcada = await servicos.buscarConsultaPorId(reagendamento[0].consulta_id);

            const verificaOcupacao = await servicos.verificarConsultaOcupada({
                sala_id: consultaMarcada[0].sala_id,
                data: reagendamento[0].novaData,
                horario: reagendamento[0].novoHorario
            });

            if (verificaOcupacao.ocupada && statusNormalizado === 'aprovado') {
                return res.status(400).json({ 
                    status: 400, 
                    mensagem: 'A consulta não está disponível para o novo horário e sala.' 
                });
            }

            await servicos.atualizarStatusReagendamento(id, statusNormalizado, motivo, usuarioId);

            if (statusNormalizado === 'aprovado') {
                await servicos.atualizarConsulta(consultaMarcada[0].id, {
                    data: reagendamento[0].novaData,
                    horario: reagendamento[0].novoHorario
                });
            }

            res.status(200).json({ 
                status: 200, 
                mensagem: `Solicitação de reagendamento ${statusNormalizado} com sucesso.` 
            });
        } catch (error) {
            const erro = funcoesGerais.criarErro(500, 'Ocorreu um erro ao atualizar a consulta.');
            res.status(erro.status).json({ status: erro.status, mensagem: erro.mensagem + 'Detalhes: ' + error.message });
        }
    });
    app.get(REAGENDAMENTO + '/retorno', autenticar, autorizar('admin'), async (req, res) => {
        try {
            const { filtro } = req.query;

            const pendencias = await servicos.buscarPendenciasReagendamento(filtro);

            if (pendencias.status) {
                return res.status(pendencias.status).json({ status: pendencias.status, mensagem: pendencias.mensagem });
            }

            if (!pendencias || pendencias.length === 0) {
                return res.status(404).json({ status: 404, mensagem: 'Nenhuma pendência de reagendamento encontrada.' });
            }

            res.status(200).json({ status: 200, pendencias });
        } catch (error) {
            const erro = funcoesGerais.criarErro(500, 'Ocorreu um erro ao buscar as pendências de reagendamento.');
            res.status(erro.status).json({ status: erro.status, mensagem: erro.mensagem + 'Detalhes: ' + error.message });
        }
    });
};