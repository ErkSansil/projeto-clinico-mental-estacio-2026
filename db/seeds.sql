-- admin padrão para primeiro acesso ao sistema
-- senha: Admin1234 (troque após o primeiro login)
INSERT INTO profissional (id, cpf, nome, email, senha, celular, matricula, privilegio) VALUES
    (10000000001, '00000000001', 'Administrador', 'admin@clinicasep.com', '$2b$10$V9jQ8qhKWBRNVklgsVC4heC0H.pmW9g6E7mFPJ4XmkE4c1ghsaUKK', '11999999999', '000000000001', 1)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO sala (id, descricao) VALUES
    ('83746291054', 'geral 1'),
    ('10938475621', 'geral 2'),
    ('57483920183', 'geral 3'),
    ('29384756102', 'geral 4'),
    ('48572910384', 'infantil'),
    ('92837465019', 'grupo'),
    ('61029384756', 'supervisao');