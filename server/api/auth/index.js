import { Router } from "express";
import signup from "./signup";
import login from "./login";
import verify from "./verify";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post('/verify', verify, (req, res) => res.json(!req.body.auth.isAuthenticated ? req.body.auth.isAuthenticated : req.body.auth.ui).end());

// router.get('/test', verifyToken, (_req: any, res: { send: (arg0: string) => any; }) => res.send("yas u hv special perms") )

export default router;