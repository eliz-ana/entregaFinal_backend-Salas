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
    res.redirect(`/cart/${cid}`);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).send("Error en el servidor");
  }
};
// Actualizar los productos de un carrito
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // Array con productos nuevos [{ product, quantity }]

    if (!Array.isArray(products)) {
      return res
        .status(400)
        .send("El cuerpo debe contener un array de productos");
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products = products;
    await cart.save();

    res.json({ message: "Carrito actualizado", cart });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Eliminar el producto de un carrito
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    // Filtrar los productos, quitando el que tenga el pid indicado
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    await cart.save();
    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).send("Error en el servidor");
  }
};
// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).send("La cantidad debe ser un número mayor a 0");
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const productInCart = cart.products.find(
      (item) => item.product.toString() === pid
    );

    if (!productInCart) {
      return res.status(404).send("Producto no encontrado en el carrito");
    }

    productInCart.quantity = quantity;
    await cart.save();

    res.json({ message: "Cantidad actualizada", cart });
  } catch (error) {
    console.error("Error al actualizar cantidad del producto:", error);
    res.status(500).send("Error en el servidor");
  }
};
// Vaciar un carrito
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products = [];
    await cart.save();

    res.json({ message: "Carrito vaciado", cart });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).send("Error en el servidor");
  }
};
// ----------------Obtener la vista del carrito-------
export const getCartView = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }
    if (!cart.products || cart.products.length === 0) {
      return res.render("cart", {
        products: [],
        total: 0,
        cartId,
        empty: true,
      });
    }

    const total = cart.products.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.render("cart", {
      products: cart.products,
      total,
      cartId,
      empty: false,
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).send("Error al cargar el carrito");
  }
};
