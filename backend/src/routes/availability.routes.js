import { Router } from "express";
import {
  getMyAvailability,
  setAvailability,
  getUserAvailability,
  getOverlap,
} from "../controllers/availability.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// USER and MENTOR can manage their own availability
router.get("/me", authorize("USER", "MENTOR"), getMyAvailability);
router.post("/me", authorize("USER", "MENTOR"), setAvailability);

// Admin can view anyone's availability and compute overlaps
router.get("/user/:userId", authorize("ADMIN"), getUserAvailability);
router.get("/overlap", authorize("ADMIN"), getOverlap);

module.exports = router;
