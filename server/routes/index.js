import express from "express";
import { validateUser } from "../middlewares/auth";
import authRoutes from "./auth.js";
import leadRoutes from "./lead.js";
import webhookRoutes from "./webhook.js";
import sseRoutes from "./sse.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/lead", validateUser, leadRoutes);
router.use("/webhook", validateUser, webhookRoutes);
router.use("/sse", sseRoutes);

export default router;
