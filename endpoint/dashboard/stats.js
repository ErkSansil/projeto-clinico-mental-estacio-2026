// arquivo endpoint/dashboard/stats.js
// retorna as estatísticas gerais da clínica para o painel do administrador

const {autenticar} = require('../../middleware/auth.js');
const db = require('../../db/metodosBd.js');

module.exports = (app) => {

    // rota que devolve contagens gerais e as últimas atividades do sistema
    app.get('/dashboard/stats', autenticar, async (req, res) => {
        try {

            // roda as 5 contagens em paralelo pra ser mais rápido
            const [
                totalConsultas,
                totalPacientes,
                totalProfissionais,
                totalSalas,
                totalCancelamentos,
                atividadesRecentes
            ] = await Promise.all([

                // total de consultas cadastradas
                db.executarQuery('SELECT COUNT(*) AS total FROM consulta', []),

                // total de pacientes cadastrados
                db.executarQuery('SELECT COUNT(*) AS total FROM paciente', []),

                // total de profissionais sem contar o admin (privilegio 0 = estagiário)
                db.executarQuery('SELECT COUNT(*) AS total FROM profissional WHERE privilegio = 0', []),

                // total de salas cadastradas
                db.executarQuery('SELECT COUNT(*) AS total FROM sala', []),

                // total de consultas com status cancelado
                db.executarQuery("SELECT COUNT(*) AS total FROM consulta WHERE status = 'cancelado'", []),

                // últimas 5 consultas criadas com nome do paciente pra mostrar na atividade recente
                db.executarQuery(`
                    SELECT c.id, c.data, c.horario, c.status, p.nome AS paciente
                    FROM consulta c
                    LEFT JOIN paciente p ON c.paciente_id = p.id
                    ORDER BY c.id DESC
                    LIMIT 5
                `, [])
            ]);

            res.status(200).json({
                status: 200,
                agendamentos: totalConsultas[0].total,
                pacientes: totalPacientes[0].total,
                profissionais: totalProfissionais[0].total,
                salas: totalSalas[0].total,
                cancelamentos: totalCancelamentos[0].total,
                atividadesRecentes: atividadesRecentes
            });

        } catch (error) {
            res.status(500).json({ status: 500, mensagem: 'Erro ao buscar estatísticas. Detalhes: ' + error.message });
        }
    });
};
