const CONSULTA = '/agendamento/consulta';
const {autenticar, autorizar} = require('../../middleware/auth.js');

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

            // todo agendamento criado entra direto como 'agendada' — estagiário ou admin
            const criacaoConsultas = await servicos.criarConsultasRecorrentes(
                paciente_id[0].id,
                usuarioLogado.id,
                sala_id[0].id,
                data,
                horario,
                observacao
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
    // rota para exportar todos os dados para geração de relatório completo em Excel
    // retorna atendimentos, cancelamentos e reagendamentos em um único endpoint
    app.get(CONSULTA + '/relatorio', autenticar, async (req, res) => {
        try {
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

            const [atendimentos, cancelamentos, reagendamentos] = await Promise.all([
                db.executarQuery(sqlAtendimentos, []),
                db.executarQuery(sqlCancelamentos, []),
                db.executarQuery(sqlReagendamentos, []),
            ]);

            res.status(200).json({ status: 200, atendimentos, cancelamentos, reagendamentos });
        } catch (error) {
            res.status(500).json({ status: 500, mensagem: 'Erro ao gerar relatório. Detalhes: ' + error.message });
        }
    });

    // lista todas as consultas com status 'pendente' para o admin aprovar ou rejeitar
    // retorna dados completos: paciente, profissional, sala, data, horário
    app.get(CONSULTA + '/pendentes', autenticar, autorizar('admin'), async (req, res) => {
        try {
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
            const pendentes = await db.executarQuery(sql, []);
            res.status(200).json({ status: 200, pendentes });
        } catch (error) {
            res.status(500).json({ status: 500, mensagem: 'Erro ao listar agendamentos pendentes. Detalhes: ' + error.message });
        }
    });

    // aprova ou rejeita um agendamento pendente criado por estagiário
    // aprovado  → status passa para 'agendada'
    // rejeitado → status passa para 'cancelada'
    app.patch(CONSULTA + '/aprovar', autenticar, autorizar('admin'), async (req, res) => {
        try {
            const { id, acao } = req.query;

            if (!id || !acao) {
                return res.status(400).json({ status: 400, mensagem: 'Os parâmetros "id" e "acao" são obrigatórios.' });
            }

            const acoesValidas = ['aprovado', 'rejeitado'];
            if (!acoesValidas.includes(String(acao).toLowerCase())) {
                return res.status(400).json({ status: 400, mensagem: 'Ação inválida. Use "aprovado" ou "rejeitado".' });
            }

            // verifica se a consulta existe e está realmente pendente
            const consultas = await db.selecionar('consulta', ['id', 'status'], { id: String(id).trim() });
            if (!consultas || consultas.length === 0) {
                return res.status(404).json({ status: 404, mensagem: 'Consulta não encontrada.' });
            }
            if (consultas[0].status !== 'pendente') {
                return res.status(422).json({ status: 422, mensagem: 'Esta consulta não está com status pendente.' });
            }

            // define o novo status conforme a ação do admin
            const novoStatus = acao === 'aprovado' ? 'agendada' : 'cancelada';
            await db.atualizar('consulta', { status: novoStatus }, { id: String(id).trim() });

            const mensagem = acao === 'aprovado'
                ? 'Agendamento aprovado com sucesso.'
                : 'Agendamento rejeitado.';

            res.status(200).json({ status: 200, mensagem });
        } catch (error) {
            res.status(500).json({ status: 500, mensagem: 'Erro ao processar aprovação. Detalhes: ' + error.message });
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