import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
//
//import apiRouter from "routes";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use("/api", (req, res) => {
    return res.send("Heyho!")
});

export default app;
