import express from "express";
import validate from "@shared/middlewares/validate";
import * as validators from "./lowerPreasure.validator";
import * as lowerPreasureController from "./lowerPreasure.controller";
import { requireAuthentication } from "@components/user/authCheck";

const router = express.Router();

router.post(
  "",
  requireAuthentication,
  validators.createValidator,
  validate,
  lowerPreasureController.create,
);

router.delete(
  "/:lowerPreasureId",
  requireAuthentication,
  validators.removeValidator,
  validate,
  lowerPreasureController.remove,
);

router.get(
  "",
  requireAuthentication,
  validators.getPaginatedWithQueryValidator,
  validate,
  lowerPreasureController.getPaginatedWithQuery,
);

export default router;
