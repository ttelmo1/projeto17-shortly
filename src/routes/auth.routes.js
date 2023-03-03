import { Router } from "express";
import { signin } from "../controllers/auth.controller.js";
import { createUser } from "../controllers/users.controller.js";
import { validateSchema } from "../middlewares/schemaValidation.middlewares.js";
import userSchema from "../models/userSchema.js"
import loginSchema from "../models/loginSchema.js"

const router = Router();

router.post("/signup", validateSchema(userSchema), createUser);
router.post("/signin", validateSchema(loginSchema), signin);

export default router;