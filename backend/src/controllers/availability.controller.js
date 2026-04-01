import prisma from "../prisma/client.js";

export const getMyAvailability = async (req, res) => {
  try {
    const slots = await prisma.availability.findMany({
      where: { userId: req.user.id },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return res.json({ availability: slots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const setAvailability = async (req, res) => {
  // Expects: { slots: [{ dayOfWeek, startTime, endTime }] }
  const { slots } = req.body;

  if (!Array.isArray(slots)) {
    return res.status(400).json({ error: "slots must be an array" });
  }

  try {
    // Replace all availability for this user
    await prisma.availability.deleteMany({ where: { userId: req.user.id } });

    const created = await prisma.availability.createMany({
      data: slots.map((s) => ({
        userId: req.user.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      skipDuplicates: true,
    });

    const updated = await prisma.availability.findMany({
      where: { userId: req.user.id },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return res.json({ message: "Availability updated", availability: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserAvailability = async (req, res) => {
  const { userId } = req.params;
  try {
    const slots = await prisma.availability.findMany({
      where: { userId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return res.json({ availability: slots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Find overlapping availability between a user and a mentor
export const getOverlap = async (req, res) => {
  const { userId, mentorId } = req.query;

  if (!userId || !mentorId) {
    return res.status(400).json({ error: "userId and mentorId required" });
  }

  try {
    const [userSlots, mentorSlots] = await Promise.all([
      prisma.availability.findMany({ where: { userId } }),
      prisma.availability.findMany({ where: { userId: mentorId } }),
    ]);

    const overlap = [];

    for (const us of userSlots) {
      for (const ms of mentorSlots) {
        if (us.dayOfWeek !== ms.dayOfWeek) continue;

        const overlapStart = us.startTime > ms.startTime ? us.startTime : ms.startTime;
        const overlapEnd = us.endTime < ms.endTime ? us.endTime : ms.endTime;

        if (overlapStart < overlapEnd) {
          overlap.push({
            dayOfWeek: us.dayOfWeek,
            startTime: overlapStart,
            endTime: overlapEnd,
          });
        }
      }
    }

    return res.json({ overlap });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};