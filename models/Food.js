import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
    },
    type: {
      type: String,
      enum: ["fruits","vegetables","grains","dairy","meat","prepared"],
      required: [true, "Food type is required"],
    },
    quantity: {
      type: String, // e.g. "10 kg", "50 portions"
      required: [true, "Quantity is required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    price: {
      type: Number, // small cost like 5–10 Rs
      default: 0,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "collected"],
      default: "available",
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to User model
      required: true,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);
export default Food;
