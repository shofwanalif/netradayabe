const { timeStamp } = require("node:console");
const prisma = require("../lib/prismaClient");
const socketConfig = require("../lib/socket");

const receiveData = async (req, res) => {
  try {
    const { device_code, voltage, current, power, status } = req.body;

    const io = socketConfig.getIO();

    let device = await prisma.device.findUnique({
      where: { deviceCode: device_code },
    });

    if (!device) {
      device = await prisma.device.create({
        data: {
          deviceCode: device_code,
          name: device_code,
          location: "unknown location",
          isActive: true,
        },
      });
      console.log(`[INFO] New Device Registered: ${device_code}`);
    }

    const newLog = await prisma.sensorLog.create({
      data: {
        deviceId: device.id,
        voltage: parseFloat(voltage),
        current: parseFloat(current),
        power: parseFloat(power),
        status: status,
      },
    });

    if (status !== "NORMAL") {
      const newAlert = await prisma.alert.create({
        data: {
          deviceId: device.id,
          type: status,
          value:
            status === "VOLTAGE_SAG"
              ? parseFloat(voltage)
              : parseFloat(current),
          message: `Terdeteksi gangguan ${status} pada alat ${device.name}`,
        },
      });

      io.emit("new alert", {
        device: device.name,
        location: device.location,
        type: status,
        value: newAlert.value,
        timeStamp: new Date(),
      });
    }

    io.emit("sensor-update", {
      deviceCode: device_code,
      voltage: voltage,
      current: current,
      power: power,
      status: status,
      timeStamp: new Date(),
    });

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error receiving data:", error);
    return res.status(500).json({ error: `${error}` });
  }
};

module.exports = { receiveData };
