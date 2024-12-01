import express from "express";
import validate from "@shared/middlewares/validate";
import * as validators from "./method.validator";
import * as methodController from "./method.controller";
import { requireAuthentication } from "@components/user/authCheck";

const router = express.Router();

router.post(
  "",
  requireAuthentication,
  validators.createMethodValidator,
  validate,
  methodController.create,
);

router.delete(
  "/:methodId",
  requireAuthentication,
  validators.removeMethodValidator,
  validate,
  methodController.remove,
);

router.get(
  "",
  requireAuthentication,
  validators.getMethodsValidator,
  validate,
  methodController.getPaginated,
);

router.get(
  "/search",
  requireAuthentication,
  validators.getMethodByQueryValidator,
  validate,
  methodController.getByQuery,
);
export default router;
