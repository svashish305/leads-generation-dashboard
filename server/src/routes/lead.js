import express from "express";
import { validateLead } from "../middlewares/lead.js";
import { createLeadController, getLeadsController } from "../controllers/lead.js";

const router = express.Router();

router.post("/", validateLead, createLeadController);
router.get("/", getLeadsController);

export default router;
