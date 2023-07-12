import express from "express";
import { sendServerEvents } from "../controllers/sse.js";

const router = express.Router();

router.get("/:userId", sendServerEvents);

export default router;
