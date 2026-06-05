CREATE TABLE consulta
(
    id BIGINT(11)  NOT NULL PRIMARY KEY,
    paciente_id     BIGINT(11)  NOT NULL,
    profissional_id BIGINT(11)  NOT NULL,
    sala_id         BIGINT(11)  NOT NULL,
    data            DATE        NOT NULL,
    horario         TIME        NOT NULL,
    observacao      TEXT        NULL,
    status          VARCHAR(55) NULL,
    CONSTRAINT fk_agendamento_paciente
    FOREIGN KEY (paciente_id) REFERENCES paciente (id),
    CONSTRAINT fk_agendamento_profissional
    FOREIGN KEY (profissional_id) REFERENCES profissional (id),
    CONSTRAINT fk_agendamento_sala
    FOREIGN KEY (sala_id) REFERENCES sala (id)
);

CREATE TABLE controlePresenca
(
    id BIGINT(11) NOT NULL PRIMARY KEY,
    paciente_id    BIGINT(11)                           NOT NULL,
    consulta_id    BIGINT(11)                           NOT NULL,
    presente       TINYINT(1)                           NOT NULL,
    observacao     VARCHAR(255)                         NULL,
    registrado_por BIGINT(11)                           NOT NULL,
    registrado_em  DATETIME DEFAULT CURRENT_TIMESTAMP() NULL,
    CONSTRAINT fk_presenca_consulta
    FOREIGN KEY (consulta_id) REFERENCES consulta (id),
    CONSTRAINT fk_presenca_registrado_por
    FOREIGN KEY (registrado_por) REFERENCES profissional (id)
);

CREATE TABLE paciente
(
    id BIGINT(11)   NOT NULL PRIMARY KEY,
    cpf                VARCHAR(11)  NOT NULL,
    nome               VARCHAR(255) NOT NULL,
    dataNascimento     DATE         NULL,
    endereco           VARCHAR(255) NULL,
    celular            VARCHAR(15)  NULL,
    senha              VARCHAR(255) NULL,
    email              VARCHAR(255) NULL,
    responsavelNome    VARCHAR(255) NULL,
    responsavelContato VARCHAR(15)  NULL,
    ativo              TINYINT(1)   NULL,
    CONSTRAINT cpf
    UNIQUE (cpf)
);

CREATE TABLE pendenciaConsulta
(
    id BIGINT(11)   NOT NULL PRIMARY KEY,
    consulta_id        BIGINT(11)   NOT NULL,
    cadastroUsuario_id BIGINT(11)   NOT NULL,
    novaData           DATE         NOT NULL,
    novoHorario        TIME         NOT NULL,
    motivo             VARCHAR(255) NOT NULL,
    statusSolicitacao  VARCHAR(55)  NULL,
    aprovadoUsuario_id BIGINT(11)   NULL,
    dataAlteracao      DATE         NULL,
    CONSTRAINT fk_pendenciaConsulta_cadastroUsuario
        FOREIGN KEY (cadastroUsuario_id) REFERENCES profissional (id),
    CONSTRAINT fk_pendenciaConsulta_consulta
        FOREIGN KEY (consulta_id) REFERENCES consulta (id)
);

CREATE TABLE profissional
(
    id BIGINT(11)   NOT NULL PRIMARY KEY,
    cpf        VARCHAR(11)  NOT NULL,
    nome       VARCHAR(255) NOT NULL,
    matricula  VARCHAR(100) NULL,
    celular    VARCHAR(15)  NULL,
    senha      VARCHAR(255) NULL,
    email      VARCHAR(255) NULL,
    privilegio TINYINT(1)   NULL,
    CONSTRAINT cpf
    UNIQUE (cpf)
);

CREATE TABLE sala
(
    id BIGINT(11) NOT NULL PRIMARY KEY,
    descricao VARCHAR(255) NULL
);

CREATE INDEX idx_paciente_cpf ON paciente(cpf);
CREATE INDEX idx_consulta_paciente_data ON consulta(paciente_id, data);
CREATE INDEX idx_presenca_paciente ON controlePresenca(paciente_id);