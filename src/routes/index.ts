import { Router } from "express";
//
import shopRouter from "routes/shop";
import authRouter from "routes/auth";

const router = Router();

router.use("/shop", shopRouter);
router.use("/auth", authRouter);
router.use("/aws", (req, res) => res.status(200).send("OK."));

export default router;
