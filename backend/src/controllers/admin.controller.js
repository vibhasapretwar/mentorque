import prisma from "../prisma/client.js";

// ─── Users ───────────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        email: true,
        name: true,
        tags: true,
        description: true,
        availabilities: true,
      },
      orderBy: { name: "asc" },
    });
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllMentors = async (req, res) => {
  try {
    const mentors = await prisma.user.findMany({
      where: { role: "MENTOR" },
      select: {
        id: true,
        email: true,
        name: true,
        tags: true,
        description: true,
        availabilities: true,
      },
      orderBy: { name: "asc" },
    });
    return res.json({ mentors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Mentor metadata management ───────────────────────────────────────────────

export const updateMentorMetadata = async (req, res) => {
  const { mentorId } = req.params;
  const { tags, description } = req.body;

  try {
    const mentor = await prisma.user.findUnique({ where: { id: mentorId } });
    if (!mentor || mentor.role !== "MENTOR") {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const updated = await prisma.user.update({
      where: { id: mentorId },
      data: {
        ...(tags !== undefined && { tags }),
        ...(description !== undefined && { description }),
      },
      select: { id: true, name: true, email: true, tags: true, description: true },
    });

    return res.json({ mentor: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ─── AI Recommendation ───────────────────────────────────────────────────────

const CALL_TYPE_CRITERIA = {
  RESUME_REVAMP: {
    ideal: ["big tech", "senior developer", "tech"],
    description: "Mentor from big tech / senior developer for resume revamp",
  },
  JOB_MARKET_GUIDANCE: {
    ideal: ["good communication", "non-tech", "public company"],
    description: "Mentor with strong communication for job market guidance",
  },
  MOCK_INTERVIEW: {
    ideal: [], // matched by domain similarity
    description: "Mentor from same domain as user for mock interview",
  },
};

function scoreMatch(user, mentor, callType) {
  const criteria = CALL_TYPE_CRITERIA[callType];
  let score = 0;
  const reasons = [];

  const mentorTagsLower = mentor.tags.map((t) => t.toLowerCase());
  const userTagsLower = user.tags.map((t) => t.toLowerCase());

  // Tag overlap bonus
  const sharedTags = userTagsLower.filter((t) => mentorTagsLower.includes(t));
  score += sharedTags.length * 10;
  if (sharedTags.length > 0) {
    reasons.push(`Shared tags: ${sharedTags.join(", ")}`);
  }

  // Call-type-specific tag matching
  for (const ideal of criteria.ideal) {
    if (mentorTagsLower.some((t) => t.includes(ideal))) {
      score += 20;
      reasons.push(`Matches criteria: ${ideal}`);
    }
  }

  // Domain matching for mock interviews
  if (callType === "MOCK_INTERVIEW") {
    const techUser = userTagsLower.includes("tech");
    const techMentor = mentorTagsLower.includes("tech");
    if (techUser === techMentor) {
      score += 25;
      reasons.push("Same domain (tech/non-tech)");
    }
  }

  // Text similarity via keyword matching
  const userDesc = (user.description || "").toLowerCase().split(/\s+/);
  const mentorDesc = (mentor.description || "").toLowerCase().split(/\s+/);
  const commonWords = userDesc.filter(
    (w) => w.length > 4 && mentorDesc.includes(w)
  );
  score += commonWords.length * 3;
  if (commonWords.length > 0) {
    reasons.push(`Description keywords match: ${[...new Set(commonWords)].slice(0, 3).join(", ")}`);
  }

  return { score, reasons };
}

export const getRecommendations = async (req, res) => {
  const { userId, callType } = req.query;

  if (!userId || !callType) {
    return res.status(400).json({ error: "userId and callType required" });
  }

  const validCallTypes = ["RESUME_REVAMP", "JOB_MARKET_GUIDANCE", "MOCK_INTERVIEW"];
  if (!validCallTypes.includes(callType)) {
    return res.status(400).json({ error: "Invalid callType" });
  }

  try {
    const [user, mentors] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { availabilities: true },
      }),
      prisma.user.findMany({
        where: { role: "MENTOR" },
        include: { availabilities: true },
      }),
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });

    const scored = mentors.map((mentor) => {
      const { score, reasons } = scoreMatch(user, mentor, callType);

      // Compute availability overlap
      const overlap = [];
      for (const us of user.availabilities) {
        for (const ms of mentor.availabilities) {
          if (us.dayOfWeek !== ms.dayOfWeek) continue;
          const oStart = us.startTime > ms.startTime ? us.startTime : ms.startTime;
          const oEnd = us.endTime < ms.endTime ? us.endTime : ms.endTime;
          if (oStart < oEnd) {
            overlap.push({ dayOfWeek: us.dayOfWeek, startTime: oStart, endTime: oEnd });
          }
        }
      }

      const availabilityScore = overlap.length > 0 ? 15 : 0;

      return {
        mentor: {
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          tags: mentor.tags,
          description: mentor.description,
        },
        score: score + availabilityScore,
        reasons,
        hasOverlap: overlap.length > 0,
        overlap,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return res.json({
      user: { id: user.id, name: user.name, tags: user.tags, description: user.description },
      callType,
      recommendations: scored,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ─── Booking ──────────────────────────────────────────────────────────────────

export const bookCall = async (req, res) => {
  const { userId, mentorId, callType, scheduledAt, duration, notes } = req.body;

  if (!userId || !mentorId || !callType || !scheduledAt) {
    return res.status(400).json({ error: "userId, mentorId, callType, scheduledAt required" });
  }

  try {
    const booking = await prisma.bookedCall.create({
      data: {
        userId,
        mentorId,
        callType,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        notes: notes || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.bookedCall.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
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

export const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { status, scheduledAt, notes } = req.body;

  try {
    const booking = await prisma.bookedCall.update({
      where: { id: bookingId },
      data: {
        ...(status && { status }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });
    return res.json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};