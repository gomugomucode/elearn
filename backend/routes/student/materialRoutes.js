import express from "express";
import { getMaterials } from "../../controllers/student/materialController.js";

const router = express.Router();

router.get("/:courseId/materials", getMaterials);

export default router;
