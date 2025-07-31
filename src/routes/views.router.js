import { Router } from "express";
import { getProductsView } from "../controllers/products.controller.js";
import Cart from "../models/cart.model.js";

const router = Router();

// 📌 Vista Home (lista de productos)
router.get("/home", getProductsView);

// 📌 Vista Cart (detalle del carrito)
router.get("/cart/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId)
      .populate("products.product") // Trae datos completos del producto
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    // Calcular total
    const total = cart.products.reduce((sum, item) => {
      return sum + (item.product.price || 0) * item.quantity;
    }, 0);

    res.render("cart", { products: cart.products, total });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).send("Error al cargar el carrito");
  }
});

export default router;
