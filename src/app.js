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

// Conexión MongoDB

mongoose
  .connect(
    "mongodb+srv://coder_backEnd1:EntregaFinal2025@cluster0.4uoqex8.mongodb.net/backend_1"
  )
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    app.listen(8080, () =>
      console.log("🚀 Servidor escuchando en puerto 8080")
    );
  })
  .catch((error) => console.error("❌ Error de conexión a MongoDB:", error));
const app = express();
const PORT = process.env.PORT || 8080;

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
