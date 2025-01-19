
import app from './app';

app.listen(process.env.CLIENT_PORT, () => console.log(`Servidor rodando na porta ${process.env.CLIENT_PORT}`));