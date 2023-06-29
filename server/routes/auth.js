import express from "express";
import { signupController, loginController, getUserController } from "../controllers/auth.js";
import { validateUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/user", validateUser, getUserController);

export default router;
