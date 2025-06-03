const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDb = require("./.config/connectDB");

// DB connection...
dotenv.config();
connectDb();

// Starting the APP
const app = express();
// middlewere

app.use(express.json());
// app.use(cors());

// Routes

// Start the server..
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Started with PORT: ${PORT} ✌️ ✌️`);
});
