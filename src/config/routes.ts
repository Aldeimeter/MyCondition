import express from "express";
import userRouter from "@components/user/routes";
import methodRouter from "@components/measures/method/method.routes";
const router = express.Router();

router.use("/users", userRouter.authRoutes);

router.use("/users", userRouter.userRoutes);

router.use("/methods", methodRouter);

export default router;
