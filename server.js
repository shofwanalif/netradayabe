require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const socketConfig = require("./src/lib/socket");

// 1. Buat HTTP Server menggunakan aplikasi Express
const server = http.createServer(app);

// 2. Inisialisasi Socket.io pada server tersebut
// Ini penting agar Socket.io bisa "menumpang" di port yang sama
const io = socketConfig.init(server);

// 3. Setup Event Listener Socket (Global)
io.on("connection", (socket) => {
  console.log("[Socket] Client connected:", socket.id);

  // const testInterval = setInterval(() => {
  //   socket.emit("sensor-update", {
  //     deviceCode: "TEST_DEVICE",
  //     voltage: 220,
  //     current: 2.5,
  //     power: 550,
  //     status: "NORMAL",
  //     timeStamp: new Date(),
  //   });
  //   console.log("[TEST] Emitting test data...");
  // }, 2000);

  socket.on("disconnect", () => {
    console.log("[Socket] Client disconnected");
  });
});

// 4. Jalankan Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server NetraDaya berjalan di port ${PORT}`);
});
