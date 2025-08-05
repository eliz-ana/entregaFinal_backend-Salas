import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

// Obtener todos los productos
// 🔹 API: devuelve JSON
export const getProducts = async (req, res) => {
  try {
    // Query params con valores por defecto
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro
    let filter = {};
    if (query) {
      const [field, value] = query.split(":");
      // Si el valor es un número, lo busca como número
      if (!isNaN(value)) {
        filter[field] = Number(value);
      } else {
        filter[field] = { $regex: value, $options: "i" };
      }
    }

    // Opciones de paginación
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
      lean: true, // Para que los documentos sean objetos simples
    };

    // Obtener productos con paginación
    const result = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    });
  } catch (error) {
    console.error("Error al obtener productos (API):", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Crear un producto
export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).send("Producto no encontrado");
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).send("Error en el servidor");
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).send("Producto no encontrado");
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error en el servidor");
  }
};

// ------------------COMIENZAN LAS VISTAS----------------------------------------
//  Vista: devuelve HTML usando Handlebars

export const getProductsView = async (req, res) => {
  try {
    // Mismos parámetros que en el endpoint API
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro
    let filter = {};
    if (query) {
      const [field, value] = query.split(":");
      if (!isNaN(value)) {
        filter[field] = Number(value);
      } else {
        filter[field] = { $regex: value, $options: "i" };
      }
    }

    // Opciones de paginación
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
      lean: true,
    };

    // Ejecutar paginación
    const result = await Product.paginate(filter, options);

    // Buscar o crear carrito
    let cart = await Cart.findOne();
    if (!cart) cart = await Cart.create({ products: [] });

    // Renderizar vista
    res.render("home", {
      products: result.docs,
      cartId: cart._id,
      limit,
      page,
      sort,
      query,
    });
  } catch (error) {
    console.error("Error al obtener productos (vista):", error);
    res.status(500).send("Error al obtener productos");
  }
};

// Obtener detalles de un producto para la vista
export const getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    // Buscar o crear carrito
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }

    res.render("productDetail", { product, cartId: cart._id });
  } catch (error) {
    console.error("Error al obtener detalle del producto:", error);
    res.status(500).send("Error en el servidor");
  }
};
