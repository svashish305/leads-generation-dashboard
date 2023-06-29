import express from "express";
import { validateUser } from "../middlewares/auth.js";
import { getLeadsController } from "../controllers/lead.js";

const router = express.Router();

router.get("/", validateUser, getLeadsController);

export default router;
