import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título del producto es obligatorio"],
    unique: true,
    trim: true,
    minlength: [3, "El título debe tener al menos 3 caracteres"],
  },
  description: {
    type: String,
    required: [true, "La descripción del producto es obligatoria"],
    trim: true,
    minlength: [10, "La descripción debe tener al menos 10 caracteres"],
  },
  code: {
    type: String,
    required: [true, "El código del producto es obligatorio"],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0, "El precio no puede ser negativo"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: [true, "El stock es obligatorio"],
    min: [0, "El stock no puede ser negativo"],
  },
  category: {
    type: String,
    required: [true, "La categoría es obligatoria"],
    trim: true,
  },
  thumbnails: {
    type: [String],
    default: [],
  },
});
const Product = mongoose.model("Product", productSchema);

export default Product;
