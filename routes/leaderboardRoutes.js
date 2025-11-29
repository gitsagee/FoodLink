import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only OR public — up to you
router.get("/", protect, authorize("admin"), getLeaderboard);

export default router;
