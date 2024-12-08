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

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors());

console.log(process.env.MONGO_URI3);

const uri = process.env.MONGO_URI3
console.log('uri :>> ', uri);
mongoose
    //.connect(process.env.MONGO_URI2)
    .connect("mongodb+srv://artprojectmongodb:litY8ebIdZ3twYBW@cluster0.qol7m.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connection to Mongo DB established"))
    .catch((err) => console.log("ERROR FROM CATCH " + err));

app.listen(port, () => {
    console.log(`Server is running on ${port} port`.bgBlue);
});

app.use("/api", testRouter);
app.use("/api/arts", artsRouter);
