import express from "express";
import { getAllArts } from "../controller/artsController.js";

const artsRouter = express.Router();

artsRouter.get("/all", getAllArts)

export default artsRouter;