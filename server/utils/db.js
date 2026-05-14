const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Database Connection successful");
  } catch (error) {
    console.log(error.message);
    console.error("Databse connection failed");
    process.exit(0);
  }
};

module.exports = connectDb;
