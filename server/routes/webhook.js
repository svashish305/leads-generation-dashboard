import express from "express";
import { validateUser } from "../middlewares/auth.js";
import { processWebhookController } from "../controllers/webhook.js";

const router = express.Router();

router.post("/:userId", validateUser, processWebhookController);

export default router;
