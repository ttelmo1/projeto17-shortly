import { Router } from "express";
import authRoutes from "./auth.routes.js";
import urlsRoutes from "./urls.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use(authRoutes);
router.use(urlsRoutes);
router.use(userRoutes);

export default router;