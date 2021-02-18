import express from "express";
import TemplateController from "../controllers/template";

const router = express.Router();
router.get("/template/:userId", TemplateController.getByUser);
router.post("/template/:userId", TemplateController.create);
router.delete("/template/:templateId", TemplateController.delete);
router.put("/template/:templateId", TemplateController.update);

export default router;
