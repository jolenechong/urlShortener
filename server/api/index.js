import { Router } from "express";
import auth from "./auth/index.js";
import shorten from "./shorten/index.js";

const router = Router();

router.get("/", (req, res) => res.json("test"));

router.use("/auth", auth);
router.use("/", shorten);

export default router;