import express from "express";
import { getUserController, updateUserController } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUserController);
router.patch("/:userId", updateUserController);

export default router;
