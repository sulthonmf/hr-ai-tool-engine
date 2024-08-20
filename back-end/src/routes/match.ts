import express from "express";
import { matchResume } from "../controllers/matchController";

const router = express.Router();

router.post("/match", matchResume);

export default router;
