const { Server } = require("socket.io");

let io;

module.exports = {
  // Fungsi ini dipanggil SEKALI saja di server.js
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000", // Ganti URL Frontend saat produksi
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });
    return io;
  },

  // Fungsi ini dipanggil di Controller manapun yang butuh kirim data
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io belum diinisialisasi!");
    }
    return io;
  },
};
