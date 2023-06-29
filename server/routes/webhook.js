import express from "express";
import { processWebhookController } from "../controllers/webhook.js";

const router = express.Router();

router.post("/:userId", processWebhookController);

export default router;
