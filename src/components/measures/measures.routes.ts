import express from "express";
import * as measuresController from "./measures.controller";
import { requireAuthentication } from "@components/user/authCheck";

const router = express.Router();

router.post("", requireAuthentication, measuresController.importMeasures);

router.get("", requireAuthentication, measuresController.exportMeasures);

export default router;
