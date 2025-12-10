# NetraDaya IoT Platform

NetraDaya adalah platform IoT (Internet of Things) untuk monitoring dan manajemen perangkat listrik secara real-time. Sistem ini memungkinkan pengumpulan data sensor, deteksi anomali, dan notifikasi alert melalui WebSocket.

## 🚀 Fitur Utama

- **Real-time Monitoring**: Pantau data sensor perangkat secara real-time menggunakan WebSocket
- **Sensor Data Collection**: Kumpulkan data tegangan (voltage), arus (current), dan daya (power)
- **Alert System**: Sistem deteksi otomatis untuk anomali seperti voltage sag, overload, dan offline device
- **Device Management**: Kelola perangkat IoT dengan kode unik dan lokasi
- **Historical Data**: Simpan dan analisis riwayat data sensor dan alert
- **RESTful API**: API lengkap untuk manajemen perangkat dan pengambilan data

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Real-time Communication**: Socket.io
- **Development**: Nodemon

## 📋 Prasyarat

- Node.js (versi 14 atau lebih tinggi)
- MySQL Server
- npm atau yarn

## ⚙️ Instalasi

1. **Clone Repository**

   ```bash
   git clone https://github.com/shofwanalif/netradayabe.git
   cd netradayabe
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Database**

   - Buat database MySQL baru
   - Konfigurasi koneksi di file `.env`

4. **Setup Environment Variables**

   Buat file `.env` di root directory:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/netradayabe"
   PORT=5000
   NODE_ENV=development
   ```

5. **Migrasi Database**

   ```bash
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:5000` (atau port yang dikonfigurasi di `.env`)

### Production Mode

```bash
node server.js
```

## 📁 Struktur Project

```
netradayabe/
├── src/
│   ├── app.js                    # Konfigurasi Express app
│   ├── controllers/
│   │   ├── deviceController.js   # Logic manajemen perangkat
│   │   └── iotController.js      # Logic pengolahan data IoT
│   ├── lib/
│   │   ├── prismaClient.js       # Konfigurasi Prisma client
│   │   └── socket.js             # Konfigurasi Socket.io
│   └── routes/
│       ├── deviceRoutes.js       # Route untuk devices
│       └── iotRoutes.js          # Route untuk IoT data
├── prisma/
│   ├── schema.prisma             # Data model definition
│   └── migrations/               # Database migrations
├── generated/
│   └── prisma/                   # Generated Prisma client
├── server.js                     # Entry point aplikasi
├── package.json                  # Dependencies
└── .env                          # Environment variables
```

## 📡 API Endpoints

### Devices API

#### Dapatkan Semua Perangkat

```
GET /api/devices
```

Response:

```json
[
  {
    "id": 1,
    "deviceCode": "DEVICE_001",
    "name": "Perangkat Ruang 1",
    "location": "Ruang Server",
    "isActive": true
  }
]
```

#### Update Perangkat

```
PUT /api/devices/:id
```

Body:

```json
{
  "name": "Nama Baru",
  "location": "Lokasi Baru",
  "isActive": true
}
```

#### Dapatkan Riwayat Alert

```
GET /api/devices/history
```

Response:

```json
[
  {
    "id": 1,
    "deviceId": 1,
    "type": "VOLTAGE_SAG",
    "value": 180.5,
    "message": "Tegangan drop ke 180V!",
    "createdAt": "2025-12-10T10:30:00Z",
    "isRead": false
  }
]
```

### IoT API

#### Terima Data Sensor

```
POST /api/iot/data
```

Body:

```json
{
  "deviceCode": "DEVICE_001",
  "voltage": 220,
  "current": 2.5,
  "power": 550,
  "status": "NORMAL"
}
```

## 🔌 WebSocket Events

### Client Menerima Event

#### Sensor Update

```javascript
socket.on("sensor-update", (data) => {
  console.log("Data sensor:", data);
  // data: {
  //   deviceCode: string,
  //   voltage: number,
  //   current: number,
  //   power: number,
  //   status: string,
  //   timeStamp: Date
  // }
});
```

#### Alert Notification

```javascript
socket.on("alert", (data) => {
  console.log("Alert diterima:", data);
  // data: {
  //   type: "VOLTAGE_SAG" | "OVERLOAD" | "OFFLINE",
  //   value: number,
  //   message: string,
  //   deviceId: number,
  //   createdAt: Date
  // }
});
```

### Server Emit Events

```javascript
// Broadcast sensor data ke semua client
io.emit("sensor-update", sensorData);

// Broadcast alert ke semua client
io.emit("alert", alertData);
```

## 💾 Database Schema

### Device Model

```prisma
model Device {
  id         Int         @id @default(autoincrement())
  deviceCode String      @unique
  name       String?
  location   String?
  isActive   Boolean     @default(true)
  logs       SensorLog[]
  alert      Alert[]
}
```

### SensorLog Model

```prisma
model SensorLog {
  id        BigInt   @id @default(autoincrement())
  deviceId  Int
  device    Device   @relation(fields: [deviceId], references: [id])
  voltage   Float
  current   Float
  power     Float
  status    String   @default("Normal")
  createdAt DateTime @default(now())
}
```

### Alert Model

```prisma
model Alert {
  id        Int      @id @default(autoincrement())
  deviceId  Int
  device    Device   @relation(fields: [deviceId], references: [id])
  type      String   // "VOLTAGE_SAG", "OVERLOAD", "OFFLINE"
  value     Float
  message   String?
  createdAt DateTime @default(now())
  isRead    Boolean  @default(false)
}
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Jalankan server dengan auto-reload
npm start

# Migrasi database
npx prisma migrate dev

# Buka Prisma Studio (GUI untuk database)
npx prisma studio

# Generate Prisma client
npx prisma generate

# Lihat status migrasi
npx prisma migrate status

# Reset database (hanya untuk development)
npx prisma migrate reset
```

## 🌐 CORS Configuration

Saat ini, CORS diatur untuk menerima request dari semua origin (`*`). Untuk production, ubah konfigurasi di `src/app.js`:

```javascript
cors({
  origin: "https://yourdomain.com", // Ganti dengan domain frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
```

## 📝 Catatan Pengembangan

- Server menggunakan HTTP dengan Socket.io untuk real-time communication
- Data sensor disimpan ke database untuk historical tracking
- Alert system terintegrasi untuk deteksi anomali otomatis
- Nodemon digunakan untuk auto-restart saat development

## 🤝 Kontribusi

Untuk berkontribusi pada project ini, silakan:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan lisensi ISC. Lihat file `package.json` untuk detail lebih lanjut.

## 📧 Kontak & Support

Untuk pertanyaan atau bug report, silakan buka issue di [GitHub Issues](https://github.com/shofwanalif/netradayabe/issues)

---

**Dibuat dengan ❤️ untuk monitoring IoT yang lebih baik**
