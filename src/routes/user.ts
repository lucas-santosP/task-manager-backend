import express from "express";
import UserController from "../controllers/user";
import auth from "../middlewares/auth";

const router = express.Router();
router.get("/user/:userId", auth, UserController.auth);
router.post("/user/register", UserController.create);
router.post("/user/login", UserController.login);
router.delete("/user/:userId", auth, UserController.delete);
router.put("/user/:userId", auth, UserController.update);

export default router;
