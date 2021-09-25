import { Router } from "express";
//
import shopRouter from "routes/shop";
import authRouter from "routes/auth";

const router = Router();

router.use("/shop", shopRouter);
router.use("/auth", authRouter);

export default router;
