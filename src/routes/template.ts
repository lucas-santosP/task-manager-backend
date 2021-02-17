import express from "express";
import TemplateController from "../controllers/template";

const router = express.Router();
// router.get("/template/:userId", TemplateController.getAll);
router.get("/template", TemplateController.getAll); //Não vai existir
router.get("/template/:templateId", TemplateController.get);
router.post("/template", TemplateController.create);
router.put("/template/:templateId", TemplateController.update);
router.delete("/template/:templateId", TemplateController.delete);

export default router;
