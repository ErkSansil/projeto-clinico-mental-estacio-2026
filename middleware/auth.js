const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ mensagem: 'JWT_SECRET nao configurado.' });
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não enviado.' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

function autorizar(...tiposPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ mensagem: 'Não autenticado.' });
	const tipoUsuario = String(req.usuario.tipo).trim().toLowerCase();
	const tiposNormalizados = tiposPermitidos.map((tipo) => String(tipo).trim().toLowerCase());

	if (!tiposNormalizados.includes(tipoUsuario)) {
      return res.status(403).json({ mensagem: 'Sem permissão para esta rota.' });
    }
    next();
  };
}

module.exports = { autenticar, autorizar };