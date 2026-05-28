const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const HORARIOS_PERMITIDOS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function criarErro(status, mensagem) {
	return { valido: false, status, mensagem };
}

function gerarNumero11Digitos() {

    const min = 10000000000; 
    const max = 99999999999;
    
    const numeroAleatorio = crypto.randomInt(min, max);
    
    return numeroAleatorio.toString(); 
}

function gerarHashSenha(senha) {
    return bcrypt.hashSync(String(senha).trim(), SALT_ROUNDS);
}

function validarCamposObrigatorios(camposObrigatorios, campos) {
    for (const campo of camposObrigatorios) {
        if (!campos[campo]) {
            return criarErro(422, `O campo ${campo} é obrigatorio.`);
        }
    }
    return { valido: true };
}

function validarEmail(email) {
    if (!EMAIL_REGEX.test(email)) {
        return criarErro(400, 'Formato de email invalido.');
    }

    return { valido: true };
}

function validarCpf(cpf) {
    if (!/^\d{11}$/.test(cpf)) {
        return criarErro(422, 'O campo de CPF deve conter exatamente 11 digitos numericos.');
    }

    return { valido: true };
}

function validarSenha(senha) {
	if (!SENHA_REGEX.test(String(senha).trim())) {
		return criarErro(400, 'A senha precisa ter pelo menos 6 caracteres, sendo pelo menos uma letra e um número.');
	}
    
    return { valido: true };
}

function validarMatricula(matricula) {
    if (!/^\d{12}$/.test(matricula)) {
        return criarErro(400, 'O campo de matricula deve conter exatamente 12 digitos numéricos.');
    }
    
    return { valido: true };
}

function validarData(data) {
    const dataFormatada = formatarData(data);
    
    if (!dataFormatada.valido) {
        return dataFormatada;
    }

    const dataParsed = new Date(dataFormatada.data);
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    if (dataParsed < dataAtual) {
        return criarErro(400, 'A data informada é anterior à data atual.');
    }

    return { valido: true };
}

function normalizarTexto(valor = '') {
	return String(valor).trim();
}

function formatarData(valorData) {
    const textoData = normalizarTexto(valorData);

    if (!textoData) {
        return criarErro(422, 'O campo data é obrigatorio.');
    }

    const partesData = textoData.split('/');

    let dataConvertida;

    if (partesData.length === 3) {
        const [dia, mes, ano] = partesData;
        dataConvertida = new Date(`${ano}-${mes}-${dia}`);
    }

    if (Number.isNaN(dataConvertida.getTime())) {
        return criarErro(400, 'Formato de data invalido.');
    }

    return {
        valido: true,
        data: dataConvertida.toISOString().split('T')[0]
    };
}

function validarHorarioFixo(horario) {
    const horarioNormalizado = normalizarTexto(horario);

    if (!HORARIOS_PERMITIDOS.includes(horarioNormalizado)) {
        return criarErro(400, `Horário inválido. Horários disponíveis: ${HORARIOS_PERMITIDOS.join(', ')}.`);
    }

    return { valido: true };
}

function validarDiaClinica(data, horario) {
    const dataFormatada = formatarData(data);
    
    if (!dataFormatada.valido) {
        return dataFormatada;
    }

    const dataParsed = new Date(dataFormatada.data + 'T00:00:00');
    const diaSemana = dataParsed.getDay();
    const horarioNormalizado = normalizarTexto(horario);

    // 0 = domingo, 1-5 = seg-sex, 6 = sábado
    if (diaSemana === 0) {
        return criarErro(400, 'Clínica fechada aos domingos.');
    }

    if (diaSemana === 6) {
        // Sábado: funciona 08:00-13:00
        if (horarioNormalizado < '08:00' || horarioNormalizado > '13:00') {
            return criarErro(400, 'No sábado, o horário de funcionamento é 08:00 às 13:00.');
        }
    } else {
        // Seg-sex: funciona 08:00-21:00
        if (horarioNormalizado < '08:00' || horarioNormalizado > '21:00') {
            return criarErro(400, 'De segunda a sexta, o horário de funcionamento é 08:00 às 21:00.');
        }
    }

    return { valido: true };
}

module.exports = {
    gerarNumero11Digitos,
    gerarHashSenha,
    criarErro,
    validarCamposObrigatorios,
    validarEmail,
    validarSenha,
    validarCpf,
    validarMatricula,
    formatarData,
    normalizarTexto,
    validarData,
    validarHorarioFixo,
    validarDiaClinica
};