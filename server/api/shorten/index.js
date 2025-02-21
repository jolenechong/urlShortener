import { Router } from "express";
import shorten from "./shorten.js";
import access from "./access.js";
import verify from "../auth/verify.js";

const router = Router();

router.post("/shorten", verify, shorten);
router.post("/access", verify, access);

export default router;