import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;
// Conexión MongoDB

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error de conexión a MongoDB:", err);
    process.exit(1); // opcional: salir si no conecta
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Handlebars (por si más adelante querés vistas simples)
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Vistas
app.use("/", viewsRouter);
// Ruta raíz opcional
app.get("/", (req, res) => {
  res.send("API de Productos y Carritos en funcionamiento");
});
start();
