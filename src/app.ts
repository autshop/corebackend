import express from "express";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
//
import apiRouter from "routes";

const origin = process.env.ORIGIN_URL || "http://shop.akosfi.com";
const corsOptions: CorsOptions = {
    origin,
    credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use("/api", apiRouter);

export default app;
