import Fund from "../models/Fund.js";

// @desc    Create a monetary donation
// @route   POST /api/funds
// @access  Donor only
export const createFund = async (req, res) => {
  try {
    const { amount, paymentMethod, purpose } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({ message: "Amount & payment method required" });
    }

    const donation = await Fund.create({
      amount,
      paymentMethod,
      purpose,
      donor: req.user._id, // logged-in donor
      status: "completed", // assuming success
      transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    });

    res.status(201).json(donation);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's donations
// @route   GET /api/funds/my
// @access  Donor only
export const getMyFunds = async (req, res) => {
  try {
    const donations = await Fund.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all donations (Admin only)
// @route   GET /api/funds
// @access  Admin
export const getAllFunds = async (req, res) => {
  try {
    const allDonations = await Fund.find()
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    res.json(allDonations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
