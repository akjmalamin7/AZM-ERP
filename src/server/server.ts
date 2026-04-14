import app from "@/app";
import "dotenv/config";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4004;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI as string)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed!");
    console.error(err.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port:http://127.0.0.1:${PORT}`);
});
