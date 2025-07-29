import { Router } from "express";
import path from "path";
import ProductManager from "../managers/productManager.js";

const router = Router();
// con PATH.RESOLVE se obtiene la ruta absoluta del archivo products.json
//se evita errores al usar rutas relativas
const productManager = new ProductManager(path.resolve("products.json"));

// ------Esta ruta obtiene todos los productos del archivo products.json
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener los productos" });
  }
});
// ------Esta ruta agrega un nuevo producto al archivo products.json
router.post("/", async (req, res) => {
  try {
    const result = await productManager.addProduct(req.body);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// ------Esta ruta obtiene un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const id = Number(req.params.pid);
    const product = await productManager.getProductById(id);

    if (!product) {
      return res
        .status(404)
        .json({ error: `Producto con ID ${id} no encontrado` });
    }

    res.json(product);
  } catch (error) {
    console.error("Error en GET /:pid:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// ------Esta ruta actualiza un producto por su ID
router.put("/:pid", async (req, res) => {
  try {
    const id = Number(req.params.pid);
    const updateData = req.body;

    const result = await productManager.updateProduct(id, updateData);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: "Producto actualizado", product: result });
  } catch (error) {
    console.error("Error en PUT /:pid:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// ------Esta ruta elimina un producto por su ID
router.delete("/:pid", async (req, res) => {
  try {
    const id = Number(req.params.pid);
    const result = await productManager.deleteProduct(id);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: "Producto eliminado", product: result });
  } catch (error) {
    console.error("Error en DELETE /:pid:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
