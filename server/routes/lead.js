import express from "express";
import { getLeadsController } from "../controllers/lead.js";

const router = express.Router();

router.get("/", getLeadsController);

export default router;
