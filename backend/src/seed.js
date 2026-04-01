import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.bookedCall.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // ─── Admin ───────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@mentorque.com",
      password: hash("admin123"),
      name: "Admin User",
      role: "ADMIN",
      tags: [],
      description: "Platform administrator",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // ─── Mentors ─────────────────────────────────────────────────────────────────
  const mentorsData = [
    {
      email: "arjun.sharma@mentorque.com",
      password: hash("mentor123"),
      name: "Arjun Sharma",
      role: "MENTOR",
      tags: ["tech", "big tech", "senior developer", "India"],
      description:
        "Senior Software Engineer at Google with 10+ years in distributed systems and backend engineering. Passionate about helping candidates ace system design interviews.",
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
        { dayOfWeek: 3, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 6, startTime: "10:00", endTime: "14:00" },
      ],
    },
    {
      email: "priya.nair@mentorque.com",
      password: hash("mentor123"),
      name: "Priya Nair",
      role: "MENTOR",
      tags: ["tech", "big tech", "good communication", "Ireland"],
      description:
        "Engineering Manager at Meta, Dublin. Expert in frontend engineering and leadership. Known for breaking down complex technical concepts with clarity.",
      availability: [
        { dayOfWeek: 2, startTime: "10:00", endTime: "13:00" },
        { dayOfWeek: 4, startTime: "17:00", endTime: "20:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "11:00" },
      ],
    },
    {
      email: "rahul.verma@mentorque.com",
      password: hash("mentor123"),
      name: "Rahul Verma",
      role: "MENTOR",
      tags: ["non-tech", "good communication", "public company", "India"],
      description:
        "Product Marketing Manager at Infosys. Specializes in guiding non-technical candidates through job market navigation, personal branding, and interview storytelling.",
      availability: [
        { dayOfWeek: 1, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "12:00" },
        { dayOfWeek: 6, startTime: "11:00", endTime: "14:00" },
      ],
    },
    {
      email: "sara.oconnor@mentorque.com",
      password: hash("mentor123"),
      name: "Sara O'Connor",
      role: "MENTOR",
      tags: ["non-tech", "good communication", "Ireland", "public company"],
      description:
        "HR Business Partner at Accenture Ireland. Experienced in resume crafting, behavioral interviews, and career transitions across multiple industries.",
      availability: [
        { dayOfWeek: 2, startTime: "14:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "12:00" },
        { dayOfWeek: 5, startTime: "16:00", endTime: "19:00" },
      ],
    },
    {
      email: "vikram.patel@mentorque.com",
      password: hash("mentor123"),
      name: "Vikram Patel",
      role: "MENTOR",
      tags: ["tech", "senior developer", "public company", "India", "good communication"],
      description:
        "Principal Engineer at Wipro with expertise in Java and cloud architecture. Conducts mock interviews for backend and full-stack engineering roles. Very structured approach to feedback.",
      availability: [
        { dayOfWeek: 0, startTime: "10:00", endTime: "13:00" },
        { dayOfWeek: 3, startTime: "19:00", endTime: "21:00" },
        { dayOfWeek: 5, startTime: "14:00", endTime: "17:00" },
      ],
    },
  ];

  const mentors = [];
  for (const m of mentorsData) {
    const { availability, ...userData } = m;
    const mentor = await prisma.user.create({
      data: {
        ...userData,
        availabilities: {
          create: availability,
        },
      },
    });
    mentors.push(mentor);
    console.log("✅ Mentor created:", mentor.email);
  }

  // ─── Users ────────────────────────────────────────────────────────────────────
  const usersData = [
    {
      email: "ananya.reddy@example.com",
      password: hash("user123"),
      name: "Ananya Reddy",
      role: "USER",
      tags: ["tech", "asks a lot of questions"],
      description:
        "Recent computer science graduate looking to break into FAANG companies. Strong in algorithms but needs help with system design and resume presentation.",
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "13:00" },
        { dayOfWeek: 6, startTime: "10:00", endTime: "15:00" },
      ],
    },
    {
      email: "rohan.gupta@example.com",
      password: hash("user123"),
      name: "Rohan Gupta",
      role: "USER",
      tags: ["tech", "good communication"],
      description:
        "Software developer with 3 years of experience switching from a startup to a product-based company. Needs guidance on the job market and negotiation strategies.",
      availability: [
        { dayOfWeek: 2, startTime: "10:00", endTime: "14:00" },
        { dayOfWeek: 4, startTime: "18:00", endTime: "21:00" },
      ],
    },
    {
      email: "meera.krishnan@example.com",
      password: hash("user123"),
      name: "Meera Krishnan",
      role: "USER",
      tags: ["non-tech", "good communication", "asks a lot of questions"],
      description:
        "Marketing professional with 5 years of experience at a startup looking to pivot to a larger organization. Needs help with personal branding and interview prep.",
      availability: [
        { dayOfWeek: 3, startTime: "09:00", endTime: "12:00" },
        { dayOfWeek: 5, startTime: "16:00", endTime: "19:00" },
      ],
    },
    {
      email: "aditya.singh@example.com",
      password: hash("user123"),
      name: "Aditya Singh",
      role: "USER",
      tags: ["tech", "asks a lot of questions"],
      description:
        "Final year B.Tech student targeting top tech companies. Wants to practice system design and coding interviews extensively before campus placements.",
      availability: [
        { dayOfWeek: 1, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 3, startTime: "19:00", endTime: "21:00" },
        { dayOfWeek: 6, startTime: "11:00", endTime: "14:00" },
      ],
    },
    {
      email: "deepika.menon@example.com",
      password: hash("user123"),
      name: "Deepika Menon",
      role: "USER",
      tags: ["non-tech"],
      description:
        "HR professional transitioning into talent acquisition at a tech firm. Looking for guidance on updating her resume to highlight transferable skills.",
      availability: [
        { dayOfWeek: 2, startTime: "14:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "09:00", endTime: "12:00" },
      ],
    },
    {
      email: "karthik.rajan@example.com",
      password: hash("user123"),
      name: "Karthik Rajan",
      role: "USER",
      tags: ["tech", "good communication"],
      description:
        "DevOps engineer with 4 years of experience wanting to transition to a software engineering role at a big tech company. Needs resume overhaul and interview coaching.",
      availability: [
        { dayOfWeek: 0, startTime: "10:00", endTime: "13:00" },
        { dayOfWeek: 5, startTime: "14:00", endTime: "17:00" },
      ],
    },
    {
      email: "sneha.iyer@example.com",
      password: hash("user123"),
      name: "Sneha Iyer",
      role: "USER",
      tags: ["non-tech", "good communication", "asks a lot of questions"],
      description:
        "Content strategist with 6 years of experience exploring opportunities at top product companies. Wants help articulating her impact and preparing for case study interviews.",
      availability: [
        { dayOfWeek: 2, startTime: "10:00", endTime: "13:00" },
        { dayOfWeek: 5, startTime: "09:00", endTime: "11:00" },
      ],
    },
    {
      email: "nikhil.joshi@example.com",
      password: hash("user123"),
      name: "Nikhil Joshi",
      role: "USER",
      tags: ["tech"],
      description:
        "Backend developer with 2 years of experience at a mid-sized company targeting senior roles. Needs mock interviews focused on system design and behavioral questions.",
      availability: [
        { dayOfWeek: 3, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 6, startTime: "10:00", endTime: "14:00" },
      ],
    },
    {
      email: "pooja.desai@example.com",
      password: hash("user123"),
      name: "Pooja Desai",
      role: "USER",
      tags: ["non-tech", "good communication"],
      description:
        "Business analyst at a consulting firm aiming to move into product management. Needs resume help and guidance on breaking into the PM job market.",
      availability: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
        { dayOfWeek: 4, startTime: "17:00", endTime: "20:00" },
      ],
    },
    {
      email: "aryan.kapoor@example.com",
      password: hash("user123"),
      name: "Aryan Kapoor",
      role: "USER",
      tags: ["tech", "asks a lot of questions"],
      description:
        "Self-taught developer building a portfolio and looking for his first software engineering role. Very curious about the entire hiring process from resume to offer negotiation.",
      availability: [
        { dayOfWeek: 0, startTime: "11:00", endTime: "14:00" },
        { dayOfWeek: 3, startTime: "09:00", endTime: "12:00" },
        { dayOfWeek: 5, startTime: "17:00", endTime: "20:00" },
      ],
    },
  ];

  for (const u of usersData) {
    const { availability, ...userData } = u;
    const user = await prisma.user.create({
      data: {
        ...userData,
        availabilities: {
          create: availability,
        },
      },
    });
    console.log("✅ User created:", user.email);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login Credentials:");
  console.log("─────────────────────────────────────────");
  console.log("ADMIN:  admin@mentorque.com / admin123");
  console.log("─────────────────────────────────────────");
  console.log("MENTORS (password: mentor123):");
  for (const m of mentorsData) {
    console.log(`  ${m.email}`);
  }
  console.log("─────────────────────────────────────────");
  console.log("USERS (password: user123):");
  for (const u of usersData) {
    console.log(`  ${u.email}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());