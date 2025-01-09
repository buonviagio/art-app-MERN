import express from "express"
import { getUserWithPostedArts, avatarUpload, register, login, getProfile } from "../controller/userController.js";
import multerUpload from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";
const userRouter = express.Router();

//userRouter.post("/register",  register);
//userRouter.post("/register", multerUpload.single("avatar"), register);
userRouter.post("/avatarUpload", jwtAuth, multerUpload.single("avatar"), avatarUpload);
userRouter.post("/register", register);
userRouter.get("/getallinfo", getUserWithPostedArts);
userRouter.post("/login", login);
userRouter.get("/profile", jwtAuth, getProfile);

export default userRouter;