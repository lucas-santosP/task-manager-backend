import express from "express";
import TemplateController from "../controllers/template";

const router = express.Router();
router.get("/template", TemplateController.getAll);
router.post("/template", TemplateController.create);
// router.get('/:id', TaskController.get);
// router.put('/:id', TaskController.update);
// router.delete('/:id', TaskController.delete);

export default router;
