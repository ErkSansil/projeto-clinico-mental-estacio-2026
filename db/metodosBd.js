const db = require('/conexao');
const tabelasPermitidas = ['paciente', 'agendamento', 'profissional'];


async function inserir(tabela, data = {}) {
    validarTabela(tabela, 'inserir');

    const colunas = Object.keys(data);
    const valores = Object.values(data);
    const placeholders = colunas.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tabela} (${colunas.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.execute(sql, valores);
    return result;
}

async function selecionar(tabela, colunas = ['*'], where = {}) {
    validarTabela(tabela, 'selecionar');

    const whereClausula = Object.keys(where).map(coluna => `${coluna} = ?`).join(' AND ');
    const sql = `SELECT ${colunas.join(', ')} FROM ${tabela}${whereClausula ? ' WHERE ' + whereClausula : ''}`;
    const [rows] = await db.execute(sql, Object.values(where));
    return rows;
}

async function atualizar(tabela, data = {}, where = {}) {
    validarTabela(tabela, 'atualizar');

    const colunas = Object.keys(data);
    const valores = Object.values(data);
    const setClausula = colunas.map(coluna => `${coluna} = ?`).join(', ');
    const whereClausula = Object.keys(where).map(coluna => `${coluna} = ?`).join(' AND ');
    const sql = `UPDATE ${tabela} SET ${setClausula} WHERE ${whereClausula}`;
    const [result] = await db.execute(sql, [...valores, ...Object.values(where)]);
    return result;
}

async function deletar(tabela, where = {}) {
    validarTabela(tabela, 'deletar');

    const whereClausula = Object.keys(where).map(coluna => `${coluna} = ?`).join(' AND ');
    const sql = `DELETE FROM ${tabela} WHERE ${whereClausula}`;
    const [result] = await db.execute(sql, Object.values(where));
    return result;
}

function validarTabela(tabela, funcao) {
    if (!tabelasPermitidas.includes(tabela)) {
        throw new Error('Tabela não permitida');
    }

    if (funcao === 'deletar' || funcao === 'atualizar' || funcao === 'inserir') {
        if (Object.keys(where).length === 0) {
            throw new Error('WHERE obrigatório');
        }
    }
}

module.exports = {
    inserir,
    selecionar,
    atualizar,
    deletar
};