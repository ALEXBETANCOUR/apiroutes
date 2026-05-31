import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { conectarMongoDB } from './config/database.js';
import indexRoutes from './routes/index.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

conectarMongoDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API de YouTube funcionando correctamente' });
});

app.use('/api', indexRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
