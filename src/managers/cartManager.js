import { promises as fs } from "fs";
import { resolve } from "path";
import ProductManager from "./productManager.js";

//instancia de ProductManager para usar sus métodos
const productManager = new ProductManager(resolve("products.json"));

class CartManager {
  constructor(filePath) {
    this.filePath = resolve(filePath);
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer carts:", error);
      return [];
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();

      const newCart = {
        id: Date.now(),
        products: [],
      };

      carts.push(newCart);
      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Error al crear carrito:", error);
      return { error: "Falla al crear carrito (manager)" };
    }
  }
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === Number(id));
      return cart || null;
    } catch (error) {
      console.error("Error al obtener carrito por ID:", error);
      return null;
    }
  }
  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id == cartId);
      if (!cart) {
        return { error: `No se encontró el carrito con ID ${cartId}` };
      }
      const product = await productManager.getProductById(productId);
      if (!product) {
        return { error: `El producto con ID ${productId} no existe` };
      }

      // Buscar si el producto ya está en el carrito
      const productInCart = cart.products.find((p) => p.product === productId);

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      return { error: "Falla al agregar producto al carrito (manager)" };
    }
  }
}

export default CartManager;
