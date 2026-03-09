require("dotenv").config();

const express = require("express");
const app = express();

// Database connection
const sequelize = require("./config/db");

// Models
const User = require("./models/User");

// Routes
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

/* =========================
   DATABASE SYNC
========================= */

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database & tables synced!");
  })
  .catch((err) => {
    console.log("Error syncing database:", err);
  });

/* =========================
   BASIC ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Auth API running");
});

/* =========================
   AUTH ROUTES
========================= */

app.use("/api/auth", authRoutes);

/* =========================
   START SERVER
========================= */

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});