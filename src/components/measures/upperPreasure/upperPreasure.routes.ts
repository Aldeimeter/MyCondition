import express from "express";
import validate from "@shared/middlewares/validate";
import * as validators from "./upperPreasure.validator";
import * as upperPreasureController from "./upperPreasure.controller";
import { requireAuthentication } from "@components/user/authCheck";

const router = express.Router();

router.post(
  "",
  requireAuthentication,
  validators.createValidator,
  validate,
  upperPreasureController.create,
);

router.delete(
  "/:upperPreasureId",
  requireAuthentication,
  validators.removeValidator,
  validate,
  upperPreasureController.remove,
);

router.get(
  "",
  requireAuthentication,
  validators.getPaginatedWithQueryValidator,
  validate,
  upperPreasureController.getPaginatedWithQuery,
);

export default router;
