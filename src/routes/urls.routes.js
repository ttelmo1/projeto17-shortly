import { Router } from "express";
import { authValidation } from "../middlewares/authorization.middlewares.js";
import { deleteShortUrl, getShortUrlById, openShortUrl, shortenUrl } from "../controllers/urls.controller.js";

const router = Router();

router.post("/urls/shorten", authValidation ,shortenUrl);
router.get("/urls/:id", getShortUrlById)
router.get("/urls/open/:shortURL", openShortUrl)
router.delete("/urls/:id", authValidation, deleteShortUrl)

export default router;