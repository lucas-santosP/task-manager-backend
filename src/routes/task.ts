import express from "express";
import TaskController from "../controllers/task";

const router = express.Router();
router.get("/task", TaskController.getAll); //Não vai existir
router.post("/task/:templateId", TaskController.create);
router.delete("/task/:templateId&&:taskId", TaskController.delete);
router.put("/task/:templateId&&:taskId", TaskController.update);

export default router;
