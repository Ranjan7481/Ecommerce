const express = require("express");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


const authRouter = require("./src/routes/auth");
const userRouter= require("./src/routes/profile");
const productRouter = require("./src/routes/product");
const orderRouter = require("./src/routes/order");

app.use("/", orderRouter);
app.use("/", authRouter);
app.use("/", userRouter)
app.use("/", productRouter);












connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
