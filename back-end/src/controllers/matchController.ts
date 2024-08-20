import { Request, Response } from "express";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export const matchResume = async (req: Request, res: Response) => {
  const { resumeText, jobDescriptionText } = req.body;

  if (!resumeText || !jobDescriptionText) {
    return res
      .status(400)
      .json({ message: "Resume text and job description text are required." });
  }

  try {
    // Escape quotes and other special characters in texts
    const escapedResumeText = resumeText
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
    const escapedJobDescriptionText = jobDescriptionText
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
    const command = `python python/similarity.py "${escapedResumeText}" "${escapedJobDescriptionText}"`;

    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error("Python script error:", stderr);
      return res.status(500).json({ message: "Error running matching script" });
    }

    // Make sure stdout is valid JSON
    const result = JSON.parse(stdout);
    res.json(result);
  } catch (error) {
    console.error("Error running matching script:", error);
    res.status(500).json({ message: "Error running matching script" });
  }
};
