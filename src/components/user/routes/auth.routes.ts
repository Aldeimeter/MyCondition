import express from "express";
import validate from "@shared/middlewares/validate";
import validators from "../validators";
import userControllers from "../controllers";
import { requireAuthentication } from "../authCheck";

const router = express.Router();
router.post(
  "/login",
  validators.loginValidator,
  validate,
  userControllers.login,
);
router.post(
  "/signup",
  validators.signUpValidator,
  validate,
  userControllers.signup,
);
router.post("/logout", requireAuthentication, userControllers.logout);
router.post("/master-logout", requireAuthentication, userControllers.logoutAll);
router.post("/reauth", userControllers.refreshAccessToken);

export default router;
