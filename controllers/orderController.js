// controllers/orderController.js
import Order from "../models/Order.js";
import Food from "../models/Food.js";

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status } = req.body;
    if (!["pending","confirmed","in-transit","delivered"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// POST /orders -> NGO places order
// controllers/orderController.js

export const placeOrder = async (req, res) => {
  try {
    const { foodId, quantity, deliveryAddress } = req.body;

    const food = await Food.findById(foodId);
    if (!food || food.status !== "available") {
      return res.status(400).json({ message: "Food not available" });
    }

    // --- UPDATED LOGIC ---
    // The amount is the total price of the food item, no multiplication needed.
    const amount = food.price;
    // --- END OF UPDATE ---

    const order = await Order.create({
      food: food._id,
      donor: food.donor,
      ngo: req.user._id,
      quantity, // Store the descriptive quantity, e.g., "10 kg"
      amount,   // Store the total price
      deliveryAddress,
    });

    // Mark the entire food item as reserved since it's sold as a whole
    food.status = "reserved";
    await food.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /orders -> NGO fetches their orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ ngo: req.user._id })
      .populate("food", "name")
      .populate("donor", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /orders/donor -> Donor fetches orders for their foods
export const getDonorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ donor: req.user._id })
      .populate("food", "name")
      .populate("ngo", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


