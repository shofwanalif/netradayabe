const { Server } = require("socket.io");

let io;

module.exports = {
  // Fungsi ini dipanggil SEKALI saja di server.js
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "*", // Ganti URL Frontend saat produksi
        methods: ["GET", "POST"],
      },
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
