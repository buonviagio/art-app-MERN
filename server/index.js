import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import testRouter from "./routes/testRouter.js";
import mongoose from "mongoose";
import colors from "colors";
import artsRouter from "./routes/artsRouter.js";
import userRouter from "./routes/userRouter.js";
import commentRouter from "./routes/commentRouter.js";
import cloudinaryConfig from "./config/cloudinaryConfiguration.js";
import passportStrategy from "./config/passport.js";
import passport from "passport";



const app = express();


const addMiddlewares = () => {
    //Parses incoming JSON requests and makes the parsed data available in req.body.
    app.use(express.json());
    //Parses incoming URL-encoded data (from HTML forms) and makes it available in req.body
    //Essential for APIs that receive JSON data in the request body, such as POST or PUT requests.
    app.use(
        express.urlencoded({
            extended: true,
        })
    );
    //CORS allows your API to handle requests from different origins (domains, ports, or protocols)
    app.use(cors());
    // A service for managing images and videos.
    cloudinaryConfig();
    passport.initialize();
    //Registers a specific Passport strategy (JwtStrategy)
    passport.use(passportStrategy);
}

const DBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connection to Mongo DB established');
    } catch (error) {
        console.log('error connecting to the MongoDB :>> ', error);
    }
}

const startServer = () => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on ${port} port`.bgBlue);
    });
}

const addRoutes = () => {
    app.use("/api", testRouter);
    app.use("/api/arts", artsRouter);
    app.use("/api/user", userRouter);
    app.use("/api/comments", commentRouter);
}

//IIFE
(async function controller() {
    await DBConnection();
    addMiddlewares();
    addRoutes();
    startServer();
})();

