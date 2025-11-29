import Food from "../models/Food.js";
import {generateFoodDetails} from "../utils/gemini.js";
// @desc    Create new food donation
// @route   POST /api/foods
// @access  Donor
export const createFood = async (req, res) => {
  try {
    const { name} = req.body;
    const imageUrl = req.file?.path; 
    const result = await generateFoodDetails(name);
    const food = await Food.create({
      name,
      imageUrl,
      donor: req.user._id,
      ...result,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all food donations
// @route   GET /api/foods
// @access  Public (or NGO/Donor)
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("donor", "name email role");
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyFoods = async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user._id }).sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food donation
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("donor", "name email role");
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update food status / details
// @route   PUT /api/foods/:id
// @access  Donor/Admin
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    // Only donor who created or admin can update
    if (food.donor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(food, req.body);
    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete food donation
// @route   DELETE /api/foods/:id
// @access  Donor/Admin
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.donor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await food.deleteOne();
    res.json({ message: "Food removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
