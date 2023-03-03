import { Router } from "express";
import authRoutes from "./auth.routes.js";
import urlsRoutes from "./urls.routes.js";
import userRoutes from "./users.routes.js";

const router = Router();

router.use(authRoutes);
router.use(urlsRoutes);
router.use(userRoutes);

export default router;