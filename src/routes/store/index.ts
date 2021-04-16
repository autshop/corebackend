import { Router } from "express";

const router = Router();

router.use("/", (req, res) => res.status(200).send("Hey"));

export default router;
