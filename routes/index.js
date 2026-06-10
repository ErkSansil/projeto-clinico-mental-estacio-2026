module.exports = (app) => {
    require('../endpoint/identidade/cadastro')(app);
    require('../endpoint/identidade/login')(app);
    require('../endpoint/agendamento/consulta')(app);
    require('../endpoint/agendamento/reagendamento')(app);
    require('../endpoint/agendamento/cancelamento')(app);
    require('../endpoint/agendamento/presenca')(app);
    // rota do painel administrativo com estatísticas gerais
    require('../endpoint/dashboard/stats')(app);
};
