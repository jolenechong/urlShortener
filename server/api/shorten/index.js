import { Router } from "express";
import shorten from "./shorten.js";
import access from "./access.js";
import get from "./get.js";
import verify from "../auth/verify.js";

const router = Router();

router.post("/shorten", verify, shorten);
router.post("/access", verify, access);
router.get("/all", get);

export default router;