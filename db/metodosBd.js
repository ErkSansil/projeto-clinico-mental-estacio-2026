const db = require('./conexao');

const TABELAS_PERMITIDAS = ['paciente', 'consulta', 'profissional', 'sala', 'controlePresenca', 'pendenciaConsulta'];

function validarTabela(tabela) {
    if (!TABELAS_PERMITIDAS.includes(tabela)) {
        throw new Error(`Tabela nao permitida: ${tabela}`);
    }
}

function validarDados(data = {}, operacao = 'operacao') {
    if (Object.keys(data).length === 0) {
        throw new Error(`Nao e possivel executar ${operacao} sem dados.`);
    }
}

function validarWhere(where = {}, operacao = 'operacao') {
    if (Object.keys(where).length === 0) {
        throw new Error(`Nao e permitido executar ${operacao} sem WHERE.`);
    }
}

function construirWhere(where = {}) {
    const colunas = Object.keys(where);
    const clausula = colunas.map((coluna) => `${coluna} = ?`).join(' AND ');
    const valores = Object.values(where);

    return {
        clausula,
        valores
    };
}

async function inserir(tabela, data = {}) {
    try {
        validarTabela(tabela);
        validarDados(data, 'INSERT');

        const colunas = Object.keys(data);
        const valores = Object.values(data);
        const placeholders = colunas.map(() => '?').join(', ');
        const sql = `INSERT INTO ${tabela} (${colunas.join(', ')}) VALUES (${placeholders})`;

        const [result] = await db.execute(sql, valores);
        return result;
    } catch (error) {
        throw new Error(`Erro ao inserir dados: ${error.message}`);
    }
}

async function selecionar(tabela, colunas = ['*'], where = {}) {
    validarTabela(tabela);

    const colunasSelecionadas = colunas.length > 0 ? colunas : ['*'];
    const whereMontado = construirWhere(where);
    const sql = `SELECT ${colunasSelecionadas.join(', ')} FROM ${tabela}${whereMontado.clausula ? ' WHERE ' + whereMontado.clausula : ''}`;

    const [rows] = await db.execute(sql, whereMontado.valores);
    return rows;
}

async function atualizar(tabela, data = {}, where = {}) {
    validarTabela(tabela);
    validarDados(data, 'UPDATE');
    validarWhere(where, 'UPDATE');

    const colunas = Object.keys(data);
    const valores = Object.values(data);
    const setClausula = colunas.map((coluna) => `${coluna} = ?`).join(', ');
    const whereMontado = construirWhere(where);
    const sql = `UPDATE ${tabela} SET ${setClausula} WHERE ${whereMontado.clausula}`;

    const [result] = await db.execute(sql, [...valores, ...whereMontado.valores]);
    return result;
}

async function deletar(tabela, where = {}) {
    validarTabela(tabela);
    validarWhere(where, 'DELETE');

    const whereMontado = construirWhere(where);
    const sql = `DELETE FROM ${tabela} WHERE ${whereMontado.clausula}`;

    const [result] = await db.execute(sql, whereMontado.valores);
    return result;
}

async function executarQuery(sql, parametros = []) {
    const [rows] = await db.execute(sql, parametros);
    return rows;
}

module.exports = {
    inserir,
    selecionar,
    atualizar,
    deletar,
    executarQuery
};