import express from "express";
import validate from "@shared/middlewares/validate";
import validators from "../validators";
import userControllers from "../controllers";
import { requireAdmin, requireAuthentication } from "../authCheck";

const router = express.Router();

router.get("/me", requireAuthentication, userControllers.fetchAuthUserProfile);

router.delete(
  "/:id",
  requireAuthentication,
  requireAdmin,
  validators.fetchUserProfileValidator,
  validate,
  userControllers.removeUser,
);
router.post(
  "",
  requireAuthentication,
  requireAdmin,
  validators.signUpValidator,
  validate,
  userControllers.createUser,
);
router.get(
  "",
  requireAuthentication,
  requireAdmin,
  validators.getPaginatedValidator,
  validate,
  userControllers.getPaginated,
);
router.post(
  "/csv",
  requireAuthentication,
  requireAdmin,
  userControllers.importFromCSV,
);
router.get(
  "/csv",
  requireAuthentication,
  requireAdmin,
  userControllers.exportToCSV,
);
export default router;
