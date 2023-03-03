import { Router } from "express";
import { signin } from "../controllers/auth.controller.js";
import { createUser } from "../controllers/users.controller.js";

const router = Router();

router.post("/signup", createUser);
router.post("/signin", signin);

export default router;