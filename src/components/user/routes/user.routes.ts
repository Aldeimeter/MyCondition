import express from "express";
import validate from "@shared/middlewares/validate";
import validators from "../validators";
import userControllers from "../controllers";
import { requireAuthentication } from "../authCheck";

const router = express.Router();

router.get("/me", requireAuthentication, userControllers.fetchAuthUserProfile);
router.get(
  "/:id",
  requireAuthentication,
  validators.fetchUserProfileValidator,
  validate,
  userControllers.fetchUserProfile,
);

export default router;
