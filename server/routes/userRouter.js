import express from "express"
import { getUserWithPostedArts, avatarUpload, register } from "../controller/userController.js";
import multerUpload from "../middlewares/multer.js";
const userRouter = express.Router();

//userRouter.post("/register",  register);
//userRouter.post("/register", multerUpload.single("avatar"), register);
userRouter.post("/avatarUpload", multerUpload.single("avatar"), avatarUpload);
userRouter.post("/register", register);
userRouter.get("/getallinfo", getUserWithPostedArts);

export default userRouter;