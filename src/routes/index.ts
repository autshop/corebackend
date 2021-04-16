import { Router } from "express";
//
import storeRouter from "routes/store";

const router = Router();

router.use("/store", storeRouter);

export default router;
