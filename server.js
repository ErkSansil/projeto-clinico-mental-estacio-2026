// arquivo server.js
// ponto de entrada principal do servidor backend da Clínica SEP

// carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// framework web para criar o servidor HTTP e gerenciar rotas
const express = require('express');

// middleware para liberar requisições de origens diferentes (CORS)
// necessário para que o frontend React Native/Web possa acessar o backend
const cors = require('cors');

// inicializa a aplicação Express
const app = express();

// porta onde o servidor vai escutar, padrão 3000
const PORT = process.env.PORT || 3000;

// permite que o servidor receba e parse JSON no corpo das requisições
app.use(express.json());

// libera o CORS para todas as origens durante o desenvolvimento
// em produção, restringir para o domínio do frontend
app.use(cors());

// registra todas as rotas da aplicação (identidade e agendamento)
require('./routes/index')(app);

// inicia o servidor na porta definida e confirma no console
app.listen(PORT, () => {
    console.log(`Servidor da Clínica SEP rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
