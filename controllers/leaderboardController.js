import Food from "../models/Food.js";
import Fund from "../models/Fund.js";
import User from "../models/User.js";

// Utility function to extract numeric quantity from strings like "10 kg", "5 portions"
const extractQuantity = (qtyStr) => {
  if (!qtyStr) return 0;
  const num = parseFloat(qtyStr);
  return isNaN(num) ? 0 : num;
};

// @desc   Get leaderboard for top donors (food + funds)
// @route  GET /api/leaderboard
// @access Admin (or public if you want)
export const getLeaderboard = async (req, res) => {
  try {
    // 1️⃣ FOOD DONATION LEADERBOARD
    const foods = await Food.find().populate("donor", "name email");

    const foodTotals = {};

    foods.forEach((item) => {
      const donorId = item.donor._id;
      const qty = extractQuantity(item.quantity);

      if (!foodTotals[donorId]) {
        foodTotals[donorId] = {
          donor: item.donor,
          totalQuantity: 0,
        };
      }

      foodTotals[donorId].totalQuantity += qty;
    });

    const foodLeaderboard = Object.values(foodTotals)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10); // top 10 donors


    // 2️⃣ FUND DONATION LEADERBOARD
    const fundData = await Fund.find({ status: "completed" })
      .populate("donor", "name email");

    const fundTotals = {};

    fundData.forEach((donation) => {
      const donorId = donation.donor._id;

      if (!fundTotals[donorId]) {
        fundTotals[donorId] = {
          donor: donation.donor,
          totalAmount: 0,
        };
      }

      fundTotals[donorId].totalAmount += donation.amount;
    });

    const fundLeaderboard = Object.values(fundTotals)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10);


    res.json({
      success: true,
      foodLeaderboard,
      fundLeaderboard,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
