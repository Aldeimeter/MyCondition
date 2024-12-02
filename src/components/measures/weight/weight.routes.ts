import express from "express";
import validate from "@shared/middlewares/validate";
import * as validators from "./weight.validator";
import * as weightController from "./weight.controller";
import { requireAuthentication } from "@components/user/authCheck";

const router = express.Router();

router.post(
  "",
  requireAuthentication,
  validators.createValidator,
  validate,
  weightController.create,
);

router.delete(
  "/:weightId",
  requireAuthentication,
  validators.removeValidator,
  validate,
  weightController.remove,
);

router.get(
  "",
  requireAuthentication,
  validators.getPaginatedWithQueryValidator,
  validate,
  weightController.getPaginatedWithQuery,
);

export default router;
