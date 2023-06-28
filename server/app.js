import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello world!"));

app.post("/webhook", (req, res) => {
  console.log("webhook payload", req.body);
  res.status(200).json(req.body);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
