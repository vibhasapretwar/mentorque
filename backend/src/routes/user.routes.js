import { Router } from "express";
import { getProfile, updateProfile, getMyBookings } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/profile", authorize("USER"), getProfile);
router.patch("/profile", authorize("USER"), updateProfile);
router.get("/bookings", authorize("USER"), getMyBookings);

module.exports = router;
