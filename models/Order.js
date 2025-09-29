import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // NGO placing the order
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Food’s original donor
    },
    quantity: {
      type: String, // e.g. "10 kg", "20 portions"
      required: true,
    },
    amount: {
      type: Number, // cost NGO pays (food.price × qty logic later)
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-transit", "delivered"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    deliveryAddress: {
      type: String,
     
    },
    deliveryPartnerId: {
      type: String, // mock delivery boy ID
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
