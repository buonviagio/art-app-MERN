import express from "express"
import multerUpload from "../middlewares/multer.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import { createComment, getAllComments, deleteComment, changeComment } from "../controller/commentController.js";

const commentRouter = express.Router();
//to create comment
commentRouter.post("/:artId", jwtAuth, createComment);
//to get all comments for one Art Object
commentRouter.get("/:artId", getAllComments);
//to delete all comments by user who posted that comment
commentRouter.post("/delete/:commentId", jwtAuth, deleteComment);
//change comment by user who posted
commentRouter.post("/change/:commentId", jwtAuth, changeComment);


export default commentRouter;