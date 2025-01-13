import express from "express";
import { getAllArts, getArtByAuthorName, getArtByStyle, uploadArtObject, getArtWithUser, addArtObjectToFavoitesOfUser } from "../controller/artsController.js";
import multerUpload from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const artsRouter = express.Router();

// artsRouter.get("/all", getAllArts);
// in this case we use from request query: {}
//artsRouter.get("/all", getArtByAuthorName);
artsRouter.get("/all", getAllArts);
// in this case we use from request params: {}
artsRouter.get("/all/:style", getArtByStyle);
//to upload new art object
artsRouter.post("/aploadArtObject", jwtAuth, multerUpload.single("artphoto"), uploadArtObject);
//to fetch all artsObject which were added by user
artsRouter.get("/allUserArts", jwtAuth, getArtWithUser);
//to add artObject to favorite
artsRouter.post("/addtofavorite", jwtAuth, addArtObjectToFavoitesOfUser);

export default artsRouter;  