import express from "express";
import userRouter from "@components/user/routes";
const router = express.Router();

router.use("/users", userRouter.authRoutes);

router.use("/users", userRouter.userRoutes);

export default router;
