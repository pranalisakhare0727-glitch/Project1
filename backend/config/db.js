const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Exit so the failure is visible and server doesn't run in a bad state
    process.exit(1);
  }
};

module.exports = connectDB;