const dotenv = require("dotenv");

dotenv.config();

const app = require("../app");
const connectDB = require("../config/database");

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

startServer();
