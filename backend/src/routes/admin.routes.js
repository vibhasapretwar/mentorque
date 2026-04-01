import { Router } from "express";
import {
  getAllUsers,
  getAllMentors,
  updateMentorMetadata,
  getRecommendations,
  bookCall,
  getAllBookings,
  updateBooking,
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/users", getAllUsers);
router.get("/mentors", getAllMentors);
router.patch("/mentors/:mentorId", updateMentorMetadata);
router.get("/recommendations", getRecommendations);
router.post("/book", bookCall);
router.get("/bookings", getAllBookings);
router.patch("/bookings/:bookingId", updateBooking);

module.exports = router;
