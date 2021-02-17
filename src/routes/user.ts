import express from "express";
import UserController from "../controllers/user";

const router = express.Router();
router.post("/user", UserController.create);
router.delete("/user/:userId", UserController.delete);

// router.get("/template/:userId", TemplateController.getAll);
// router.get("/template", TemplateController.getAll); //Não vai existir
// router.get("/template/:templateId", TemplateController.get);
// router.put("/template/:templateId", TemplateController.update);
// router.delete("/template/:templateId", TemplateController.delete);

export default router;
