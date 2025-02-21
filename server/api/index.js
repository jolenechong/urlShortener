import { Router } from "express";

const router = Router();

router.get("/", (req, res) => res.json("test"));

export default router;