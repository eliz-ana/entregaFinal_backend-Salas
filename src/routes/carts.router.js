import { Router } from "express";
import {
  getCarts,
  createCart,
  getCartById,
  addProductToCart,
  updateCartProducts,
  removeProductFromCart,
  updateProductQuantity,
  clearCart,
} from "../controllers/carts.controller.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", createCart);

// Obtener todos los carritos
router.get("/", getCarts);

// Obtener un carrito por ID
router.get("/:cid", getCartById);

// Agregar un producto a un carrito
router.post("/:cid/product/:pid", addProductToCart);
// Actualizar productos de un carrito
router.put("/:cid/products", updateCartProducts);

// Actualizar la cantidad de un producto en un carrito
router.put("/:cid/products/:pid", updateProductQuantity);
// Eliminar un producto de un carrito
router.delete("/:cid/products/:pid", removeProductFromCart);
// Limpiar un carrito
router.delete("/:cid", clearCart);

export default router;
