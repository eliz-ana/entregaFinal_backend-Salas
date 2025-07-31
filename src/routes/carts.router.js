import { Router } from "express";
import {
  getCarts,
  createCart,
  getCartById,
  addProductToCart,
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

export default router;
