import { promises as fs } from "fs";
import path from "path";

class ProductManager {
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer productos:", error);
      return [];
    }
  }
  //--------------- agrega un nuevo producto al archivo
  async addProduct(productData) {
    try {
      const products = await this.getProducts();

      // Validar campos requeridos
      const requiredFields = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "stock",
        "category",
        "thumbnails",
      ];
      const hasAllFields = requiredFields.every((field) =>
        productData.hasOwnProperty(field)
      );
      if (!hasAllFields) {
        return { error: "Todos los campos son obligatorios" };
      }

      // Verificar que no haya otro producto con el mismo código
      const codeExists = products.some((p) => p.code === productData.code);
      if (codeExists) {
        return { error: "Ya existe un producto con ese código" };
      }

      // Generar ID único
      const newProduct = {
        id: Date.now(),
        ...productData,
      };

      products.push(newProduct);
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error("Error en ProductManager:", error);
      return { error: "Falla al acceder al archivo products.json (manager)" };
    }
  }
  // --------------- obtiene un producto por su ID
  async getProductById(id) {
    try {
      const numberId = Number(id);
      const products = await this.getProducts();
      const product = products.find((p) => p.id === numberId);
      return product || null;
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      return null;
    }
  }
  // --------------- Actualiza un producto por su ID
  async updateProduct(id, updateData) {
    try {
      const numberId = Number(id);
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === numberId);

      if (index === -1) {
        return { error: `Producto con ID ${id} no encontrado` };
      }

      // No permitir que se modifique el id
      // Si el objeto updateData contiene un campo "id", retornamos un error
      // Esto es para evitar que se cambie el ID del producto
      if ("id" in updateData) {
        return { error: "No se puede modificar el ID del producto" };
      }

      // Actualizamos solo los campos enviados
      // Si un campo no se envía, se mantiene el valor actual
      // Si se envía un campo que no existe, se ignora
      products[index] = {
        ...products[index],
        ...updateData,
      };

      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return { error: "Falla al actualizar el producto (manager)" };
    }
  }
  // --------------- Elimina un producto por su ID
  async deleteProduct(id) {
    try {
      const numberId = Number(id);
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === numberId);

      if (index === -1) {
        return { error: `No se encontró un producto con ID ${id}` };
      }

      products.splice(index, 1); // eliminamos el producto

      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return { message: `Producto con ID ${id} eliminado correctamente` };
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return { error: "Falla al eliminar el producto (manager)" };
    }
  }
}

export default ProductManager;
