import mongoose from "mongoose";

const fundSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // donor user
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "cash"],
      required: [true, "Payment method is required"],
    },
    transactionId: {
      type: String,
    },
    purpose: {
      type: String,
      default: "General Support",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Fund = mongoose.model("Fund", fundSchema);
export default Fund;
