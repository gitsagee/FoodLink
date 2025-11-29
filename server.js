import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import fundRoutes from "./routes/fundRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js"
// import {generateFoodDetails} from "./utils/gemini.js";
dotenv.config();
const app = express();
// async function test(){
//   try{
//     await generateFoodDetails("jalebi");
//   }
//   catch(e){
//     console.log(e);
//   }
// }
// test();
// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/funds",fundRoutes);
app.use("/api/leaderboard",leaderboardRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("FoodLink API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
