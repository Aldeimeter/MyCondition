import express from "express";
import userRouter from "@components/user/routes";
import methodRouter from "@components/measures/method/method.routes";
import weightRouter from "@components/measures/weight/weight.routes";
import lowerPreasureRouter from "@components/measures/lowerPreasure/lowerPreasure.routes";
import upperPreasureRouter from "@components/measures/upperPreasure/upperPreasure.routes";
import measureRouter from "@components/measures/measures.routes";
import advertisementRouter from "@components/advertisement/advertisement.routes";
const router = express.Router();

router.use("/users", userRouter.authRoutes);

router.use("/users", userRouter.userRoutes);

router.use("/methods", methodRouter);

router.use("/weight", weightRouter);
router.use("/lower", lowerPreasureRouter);
router.use("/upper", upperPreasureRouter);

router.use("/measures", measureRouter);
router.use("/ad", advertisementRouter);

export default router;
