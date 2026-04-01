import { Router } from "express";
import { getMentorProfile, getMentorBookings } from "../controllers/mentor.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/profile", authorize("MENTOR"), getMentorProfile);
router.get("/bookings", authorize("MENTOR"), getMentorBookings);

module.exports = router;
