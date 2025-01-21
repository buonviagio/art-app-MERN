import express from "express";
import {
    getAllArts,
    getArtByAuthorName,
    getArtByStyle,
    uploadArtObject,
    getArtWithUser,
    addArtObjectToFavoitesOfUser,
    getAllFavoriteArtObjecsOfUser,
    deleteArtObject,
    getAllFavoriteArtObjecsOfUserForProfilePage,
    updateArtObject,
    getArtByID
} from "../controller/artsController.js";
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
// to get all favorite arts object when the user loged in
artsRouter.get("/getAllFavorites", jwtAuth, getAllFavoriteArtObjecsOfUser);
//delete art object
artsRouter.post("/deleteArtObject", jwtAuth, deleteArtObject);
// to get all favorite arts object to show on Profile
artsRouter.get("/getAllFavoritesForProfilePage", jwtAuth, getAllFavoriteArtObjecsOfUserForProfilePage);
//updating art object
artsRouter.post("/updateArtObject", jwtAuth, multerUpload.single("artphoto"), updateArtObject);
//get art object by ID
artsRouter.get("/:id", jwtAuth, getArtByID);

export default artsRouter;  