import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./managers/productManager.js";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketServer } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manager = new ProductManager(path.join(__dirname, "../products.json"));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Vista realtime
app.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  res.render("realTimeProducts", { products });
});

// WebSocket
io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  const productos = await manager.getProducts();
  socket.emit("productosActualizados", productos);

  socket.on("nuevoProducto", async (nuevo) => {
    await manager.addProduct(nuevo);
    const productosActualizados = await manager.getProducts();
    io.emit("productosActualizados", productosActualizados);
  });

  socket.on("eliminarProducto", async (id) => {
    await manager.deleteProduct(id);
    const productosActualizados = await manager.getProducts();
    io.emit("productosActualizados", productosActualizados);
  });
});

// 🔥 Acá usás PORT
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
