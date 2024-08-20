import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/", (req, res) => {
  const resumesFilePath = "resumes.json";
  if (fs.existsSync(resumesFilePath)) {
    const resumes = JSON.parse(fs.readFileSync(resumesFilePath, "utf-8"));
    res.json({ resumes });
  } else {
    res.json({ resumes: [] });
  }
});

export default router;
