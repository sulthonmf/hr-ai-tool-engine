import express from "express";
import uploadRouter from "./routes/upload";
import resumesRouter from "./routes/resumes"; // Create a new router for resumes
import matchRouter from "./routes/match";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use("/api/upload", uploadRouter);
app.use("/api/resumes", resumesRouter); // Use the new router
app.use("/api/match", matchRouter);

export default app;
