import Product from "../models/product.model.js";

// Obtener todos los productos
// 🔹 API: devuelve JSON
export const getProductsApi = async (req, res) => {
  try {
    const products = await Product.find(); // No uso lean() porque no es para HBS
    res.json(products);
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

// 🔹 Vista: devuelve HTML usando Handlebars
export const getProductsView = async (req, res) => {
  try {
    const products = await Product.find().lean(); // lean() para que Handlebars lo entienda
    res.render("home", { products });
  } catch (error) {
    console.error("Error al obtener productos (vista):", error);
    res.status(500).send("Error al obtener productos");
  }
};
