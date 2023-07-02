import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.get("/health-check", (req, res) => res.send("Hello world!"));

app.use("/api/v1", routes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
