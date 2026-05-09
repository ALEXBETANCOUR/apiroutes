const dotenv = require("dotenv");

dotenv.config();

const app = require("./server/server");
const connectDB = require("./db/mongoose");

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
}

startServer();
