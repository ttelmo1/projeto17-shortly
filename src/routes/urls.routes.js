import { Router } from "express";
import { authValidation } from "../middlewares/authorization.middlewares.js";
import { deleteShortUrl, getShortUrlById, openShortUrl, shortenUrl } from "../controllers/urls.controller.js";
import { validateSchema } from "../middlewares/schemaValidation.middlewares.js";
import urlSchema from "../models/urlSchema.js";

const router = Router();

router.post("/urls/shorten", validateSchema(urlSchema) ,authValidation ,shortenUrl);
router.get("/urls/:id", getShortUrlById)
router.get("/urls/open/:shortUrl", openShortUrl)
router.delete("/urls/:id",authValidation, deleteShortUrl)

export default router;