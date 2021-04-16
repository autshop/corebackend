import dotenv from "dotenv";
dotenv.config();
//
import app from "./app";
//import sequelize from "db";

const port = process.env.PORT || 8080;

(async () => {
    try {
        //await sequelize.authenticate();
        await app.listen(port);
        console.log(`Listening on port: ${port}.`);
    } catch (err) {
        console.log("Failed to start application.");
        console.log("Reason: ", err);
    }
})();
