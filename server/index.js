import express from "express";
import cors from "cors";
import testRouter from "./routes/testRouter.js";
import mongoose from "mongoose";
import colors from "colors";
import * as dotenv from "dotenv";
import artsRouter from "./routes/artsRouter.js";
dotenv.config();


const app = express();
const port = process.env.PORT || 5000;

//console.log(process.env.MONGODB);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors());

console.log(process.env.MONGO_URI2);


mongoose
    .connect(process.env.MONGO_URI2)
    .then(() => console.log("Connection to Mongo DB established"))
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Server is running on ${port} portt`.bgBlue);
});

app.use("/api", testRouter);
app.use("/api/arts", artsRouter);
