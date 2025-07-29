import { Router } from "express";
import path from "path";
import CartManager from "../managers/cartManager.js";

const router = Router();
const cartManager = new CartManager(path.resolve("carts.json"));
//--------ruta para crear un nuevo carrito
// Esta ruta no recibe parámetros y crea un carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();

    if (newCart.error) {
      return res.status(500).json({ error: newCart.error });
    }

    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error en POST /carts:", error);
    res.status(500).json({ error: "Error interno al crear el carrito" });
  }
});
//-------ruta para obtener todos los carritos
router.get("/:cid", async (req, res) => {
  try {
    const id = Number(req.params.cid);
    const cart = await cartManager.getCartById(id);

    if (!cart) {
      return res
        .status(404)
        .json({ error: `Carrito con ID ${id} no encontrado` });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error en GET /:cid:", error);
    res.status(500).json({ error: "Error interno al obtener el carrito" });
  }
});
//-------ruta para agregar un producto al carrito
// Esta ruta recibe el ID del carrito y el ID del producto a agregar
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);

    const result = await cartManager.addProductToCart(cartId, productId);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    res.json({ message: "Producto agregado al carrito", cart: result });
  } catch (error) {
    console.error("Error en POST /:cid/product/:pid:", error);
    res
      .status(500)
      .json({ error: "Error interno al agregar producto al carrito" });
  }
});

export default router;
