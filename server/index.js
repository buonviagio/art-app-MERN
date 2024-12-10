import express from "express";
import cors from "cors";
import testRouter from "./routes/testRouter.js";
import mongoose from "mongoose";
import colors from "colors";
import * as dotenv from "dotenv";
import artsRouter from "./routes/artsRouter.js";
import userRouter from "./routes/userRouter.js";
import cloudinaryConfig from "./config/cloudinaryConfiguration.js";
dotenv.config();


const app = express();


const addMiddlewares = () => {
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );
    app.use(cors());
    cloudinaryConfig();
}

const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connection to Mongo DB established');
    } catch (error) {
        console.log('error connecting to the MongoDB :>> ', error);
    }
}
/* mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connection to Mongo DB established"))
    .catch((err) => console.log("ERROR FROM CATCH " + err)); */

const startServer = () => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on ${port} port`.bgBlue);
    });
}

const addRoutes = () => {
    app.use("/api", testRouter);
    app.use("/api/arts", artsRouter);
    app.use("/api/user", userRouter)
}

//IIFE
(async function controller() {
    await DBConnection();
    addMiddlewares();
    addRoutes();
    startServer();
})();

