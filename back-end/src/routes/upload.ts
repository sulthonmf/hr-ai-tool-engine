import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Uploaded file:", req.file);

  const filePath = req.file.path;
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  try {
    let parsedData;

    if (fileExtension === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      parsedData = await pdfParse(dataBuffer);
    } else if (fileExtension === ".docx") {
      parsedData = { text: "DOCX parsing is not yet implemented" };
    } else {
      return res.status(400).json({ message: "Unsupported file format" });
    }

    console.log("Parsed data:", parsedData);

    const extractedText = parsedData.text;

    const resumesFilePath = "resumes.json";
    const resumes = fs.existsSync(resumesFilePath)
      ? JSON.parse(fs.readFileSync(resumesFilePath, "utf-8"))
      : [];
    resumes.push({ filename: req.file.filename, extractedText });
    fs.writeFileSync(resumesFilePath, JSON.stringify(resumes, null, 2));

    res.json({
      message: "File uploaded and parsed successfully",
      file: { filename: req.file.filename }, // Ensure file object is included
      extractedText,
    });
  } catch (error) {
    console.error("Error parsing file:", error);
    res.status(500).json({ message: "Error parsing file" });
  } finally {
    fs.unlinkSync(filePath); // Clean up the uploaded file
  }
});

export default router;
