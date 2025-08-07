require("dotenv").config(); // Load environment variables first
const express = require("express");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
const authRouter = require("./src/routes/auth");
const userRouter = require("./src/routes/profile");
const productRouter = require("./src/routes/product");
const orderRouter = require("./src/routes/order");

app.use("/", orderRouter);
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", productRouter);

// DB connect and start server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
