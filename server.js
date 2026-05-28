require('dotenv').config();

const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

require('./routes')(app);

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Servidor HTTP ativo na porta ${PORT}`);
	});
}

module.exports = app;