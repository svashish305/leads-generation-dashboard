import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(rateLimit({
  windowMs: process.env.RATELIMIT_WINDOW,
  max: process.env.RATELIMIT_THRESHOLD,
  message: `Too many requests from this IP, please try again after ${process.env.RATELIMIT_WINDOW_STRING}`,
}));

connectDB();

app.use("/api/v1", routes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
