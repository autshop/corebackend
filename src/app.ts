import express from "express";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
//
import apiRouter from "routes";

const corsOptions: CorsOptions = {
    origin: "http://shop.akosfi.com",
    credentials: true
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use("/api", apiRouter);

export default app;
