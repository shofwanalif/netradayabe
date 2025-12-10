const express = require("express");
const cors = require("cors");

// route
const iotRoutes = require("./routes/iotRoutes");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

app.use(
  cors({
    origin: "*", // Ganti dengan URL Frontend saat produksi
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/iot", iotRoutes);
app.use("/api/devices", deviceRoutes);

// error handling
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

module.exports = app;
