import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Obtener todos los carritos
export const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product").lean();
    res.json(carts);
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Obtener un carrito por ID
export const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.json(cart);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Agregar un producto a un carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).send("Error en el servidor");
  }
};
