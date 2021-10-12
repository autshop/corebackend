import dotenv from "dotenv";
dotenv.config();
import { config as AWSConfig } from "aws-sdk";
//
import app from "./app";
import sequelize from "db";

const port = process.env.PORT || 8080;

(async () => {
    try {
        await sequelize.authenticate();
        await app.listen(port);
        console.log(`Listening on port: ${port}.`);
        AWSConfig.update({ region: "eu-west-3" });
    } catch (err) {
        console.log("Failed to start application.");
        console.log("Reason: ", err);
    }
})();
