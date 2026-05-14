require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
const authRoute = require("./routes/auth-router");
const adminRoute = require("./routes/admin-router");
const commanRoute = require("./routes/comman-router");
const userRoute = require("./routes/user-router");

const connectDb = require("./utils/db");
const errorMiddleware = require("./middleware/error-middleware");
const cookieParser = require("cookie-parser");
//Handle CORS
const corsOptions = {
  origin: ["https://www.thinkbotic.in", "http://localhost:5173","https://thinkbotic.in","http://localhost:3000"],
  methods: "GET, POST, PUT, DELETE, PATCH",
  credentials: true,
};
// 
app.get("/test-razorpay", async (req, res) => {
  try {

    const order = await razorpay.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "test_receipt"
    });

    res.json(order);

  } catch (error) {

    console.log(error);

    res.json({
      error
    });
  }
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);

// Common get route for all
app.use("/api/comman", commanRoute);

// Serve static files from the uploads directory
// app.use("/uploads", express.static(process.env.UPLOAD_PATH));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = 5000;
app.use(errorMiddleware);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port:${PORT}`);
  });
});
