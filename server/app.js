import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/lead.js";
import webhookRoutes from "./routes/webhook.js";
import sseRoutes from "./routes/sse.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get("/health-check", (req, res) => res.send("Hello world!"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/lead", leadRoutes);
app.use("/api/v1/webhook", webhookRoutes);
app.use("/api/v1/sse", sseRoutes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
