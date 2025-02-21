import { Router } from "express";
import shorten from "./shorten";

const router = Router();

router.post("/shorten/:url", shorten);

export default router;