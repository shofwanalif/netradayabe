const prisma = require("../lib/prismaClient");

const getAllDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        _count: { select: { alert: true } },
      },
    });
    return res.status(200).json(devices);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateDevice = async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;

  try {
    const updatedDevice = await prisma.device.update({
      where: { id: parseInt(id) },
      data: { name, location },
    });

    return res.status(200).json(updatedDevice);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAlertHistory = async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        device: {
          select: { name: true, location: true },
        },
      },
    });

    return res.status(200).json(alerts);
  } catch (error) {
    console.error("Error in getAlertHistory:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDevices,
  updateDevice,
  getAlertHistory,
};
