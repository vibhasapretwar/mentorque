import prisma from "../prisma/client.js";

export const getMentorProfile = async (req, res) => {
  try {
    const mentor = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tags: true,
        description: true,
        availabilities: true,
        bookedCallsAsMentor: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { scheduledAt: "asc" },
        },
      },
    });
    return res.json({ mentor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMentorBookings = async (req, res) => {
  try {
    const bookings = await prisma.bookedCall.findMany({
      where: { mentorId: req.user.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });
    return res.json({ bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};