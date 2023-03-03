import { Router } from "express";
import { authValidation } from "../middlewares/authorization.middlewares.js";
import { getShortUrlById, shortenUrl } from "../controllers/urls.controller.js";

const router = Router();

router.post("/urls/shorten", authValidation ,shortenUrl);
router.get("/urls/:id", getShortUrlById)

export default router;