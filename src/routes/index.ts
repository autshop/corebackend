import { Router } from "express";
//
import storeRouter from "routes/store";
import authRouter from "routes/auth";

const router = Router();

router.use("/store", storeRouter);
router.use("/auth", authRouter);

export default router;
