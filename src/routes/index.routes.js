import { Router } from "express";
import authRoutes from "./auth.routes.js";
import urlsRoutes from "./urls.routes.js";

const router = Router();

router.use(authRoutes);
router.use(urlsRoutes)

export default router;