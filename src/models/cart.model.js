import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // referencia al modelo Product
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "La cantidad no puede ser menor a 1"],
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
