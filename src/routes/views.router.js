import { Router } from "express";
import {
  getProductsView,
  getProductDetail,
} from "../controllers/products.controller.js";
import { getCartView } from "../controllers/carts.controller.js";

const router = Router();

//  Vista Home (lista de productos)
router.get("/home", getProductsView);

//  Vista Product Detail
router.get("/products/:pid", getProductDetail);

//  Vista Cart (detalle del carrito)
router.get("/cart/:cid", getCartView);

export default router;
