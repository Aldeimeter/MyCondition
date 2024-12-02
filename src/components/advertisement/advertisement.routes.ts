import express from "express";
import validate from "@shared/middlewares/validate";
import * as validators from "./advertisement.validator";
import * as advertisementController from "./advertisement.controller";
import {
  requireAdmin,
  requireAuthentication,
} from "@components/user/authCheck";

const router = express.Router();

router.post(
  "",
  requireAuthentication,
  requireAdmin,
  validators.createAdvertisementValidator,
  validate,
  advertisementController.createAd,
);

router.patch(
  "/activate/:adId",
  requireAuthentication,
  requireAdmin,
  validators.modifyAdvertisementValidator,
  validate,
  advertisementController.setActive,
);

router.patch(
  "/increment/:adId",
  requireAuthentication,
  requireAdmin,
  validators.modifyAdvertisementValidator,
  validate,
  advertisementController.incrementCounter,
);

router.get(
  "/all",
  requireAuthentication,
  requireAdmin,
  validators.getPaginatedValidator,
  validate,
  advertisementController.getPaginated,
);

router.get("/active", requireAuthentication, advertisementController.getActive);
export default router;
