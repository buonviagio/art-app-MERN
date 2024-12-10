import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import { pictureUpload } from "../utils/pictureUpload.js";

const avatarUpload = async (req, res) => {
    console.log('req :>> ', req.file);
    /* try {
        const uploadedImage = await pictureUpload(req.file.path);
        if (!uploadedImage) {
            console.log("upload failed");
            return res.status(500).json({
                error: "File couldn't be uploaded"
            })
        }

        if (uploadedImage) {
            return res.status(200).json({
                message: "Avatar succesfully uploaded",
                avatar: uploadedImage
            })
        }
    } catch (error) {
        console.log("upload failed");
        return res.status(500).json({
            error: `Something went wrong ${error}`
        })
    } */

}

const getUserWithPostedArts = async (reqquest, response) => {
    console.log("MEHOD getUserWithPostedArts");
    try {
        const uallUser = await UserModel.find({}).populate({ path: "postedArtObjects" })
        if (!uallUser) {
            return response.status(400).json({
                message: "Sorry, there are nothing to send you back"
            })
        }
        response.status(200).json(
            { message: "these are all objects of arts", uallUser }
        )

    } catch (err) {
        response.status(400).json({ message: `Something went wrong ${err}` })
    }
}
export { avatarUpload, getUserWithPostedArts };