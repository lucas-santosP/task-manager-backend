import express from "express";
import UserController from "../controllers/user";

const router = express.Router();
router.get("/user", UserController.getAll);
router.post("/user", UserController.create);
router.delete("/user/:userId", UserController.delete);
router.put("/user/:userId", UserController.update);

export default router;
