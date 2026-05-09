const mongoose = require("mongoose");

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("No existe MONGO_URI en el archivo .env");
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    throw error;
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB desconectado");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Conexion MongoDB cerrada");
  process.exit(0);
});

module.exports = connectDB;
