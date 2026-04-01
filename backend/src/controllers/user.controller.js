import prisma from "../prisma/client.js";

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tags: true,
        description: true,
        availabilities: true,
        bookedCallsAsUser: {
          include: {
            mentor: { select: { id: true, name: true, email: true } },
          },
          orderBy: { scheduledAt: "asc" },
        },
      },
    });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { tags, description } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(tags !== undefined && { tags }),
        ...(description !== undefined && { description }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tags: true,
        description: true,
      },
    });
    return res.json({ user: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.bookedCall.findMany({
      where: { userId: req.user.id },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });
    return res.json({ bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};