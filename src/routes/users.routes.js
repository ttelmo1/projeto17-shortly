import { Router } from "express";
import { getUserById, ranking } from "../controllers/users.controller.js";
import { authValidation } from "../middlewares/authorization.middlewares.js";

const router = Router();

router.get("/users/me", authValidation, getUserById);
router.get("/ranking", ranking);

export default router;
