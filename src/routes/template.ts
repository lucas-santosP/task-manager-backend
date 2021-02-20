import express from "express";
import TemplateController from "../controllers/template";
import auth from "../middlewares/auth";

const router = express.Router();
router.get("/template/:userId", auth, TemplateController.getByUser);
router.post("/template/:userId", auth, TemplateController.create);
router.delete("/template/:templateId", auth, TemplateController.delete);
router.put("/template/:templateId", auth, TemplateController.update);

export default router;
