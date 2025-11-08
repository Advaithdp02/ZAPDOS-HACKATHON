
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./configs/db.js";

const PORT = process.env.PORT || 3000;

// Connect to DB first
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
