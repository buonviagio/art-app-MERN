import express from "express";
import { getAllArts, getArtByAuthorName, getArtByStyle } from "../controller/artsController.js";

const artsRouter = express.Router();

// artsRouter.get("/all", getAllArts);
// in this case we use from request query: {}
//artsRouter.get("/all", getArtByAuthorName);
artsRouter.get("/all", getAllArts);
// in this case we use from request params: {}
artsRouter.get("/all/:style", getArtByStyle);

export default artsRouter;  