import { Router } from "express";
import { authValidation } from "../middlewares/authorization.middlewares.js";
import { shortenUrl } from "../controllers/urls.controller.js";

const router = Router();

router.post("/urls/shorten", authValidation ,shortenUrl);

export default router;