import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import tourRoute from "./routes/tours.js";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import reviewRoute from "./routes/reviews.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000; // Changed to 4000 to match frontend BASE_URL

// database connection
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database connected");
  } catch (err) {
    console.log("MongoDB database failed to connect");
  }
};

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://go-go-fe.vercel.app",
      "https://www.gogoreview.xyz",
    ], // or your client-side address
    credentials: true,
  })
);

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/reviews", reviewRoute);

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});
