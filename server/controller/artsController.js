import ArtsModel from "../models/artsModel.js"
import UserModel from "../models/userModel.js";
import { pictureUpload } from "../utils/pictureUpload.js";

const getAllArts = async (request, response) => {

    try {
        const allArts = await ArtsModel.find({});

        if (allArts.length === 0) {
            return response.status(400).json({
                message: "Sorry, there are nothing to send you back"
            })
        }

        response.status(200).json(
            { message: "these are all objects of arts", allArts }
        )
    } catch (err) {
        response.status(400).json({ message: `Something went wrong ${err}` })
    }
}

const getArtByAuthorName = async (request, response) => {

    const { nameOfTheAuthor } = request.query;
    try {
        if (nameOfTheAuthor) {
            const desiredArt = await ArtsModel.find({ nameOfTheAuthor: nameOfTheAuthor })
            return response.status(200).json({
                message: `this is what you are looking for`,
                desiredArt
            })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return response.status(400).json({
            error: "Something went wrong in method getArtByAuthorName",

        })
    }
}

const getArtByStyle = async (request, response) => {
    const { style } = request.params;
    console.log('style :>> ', style);
    try {
        if (style) {
            const desiredArt = await ArtsModel.find({ style: style })
            return response.status(200).json({
                message: `this is what you are looking for`,
                desiredArt
            })
        }
    } catch (error) {
        console.log('error :>> ', error);
        return response.status(400).json({
            error: "Something went wrong in method getArtByStyle",

        })
    }
}

const uploadArtObject = async (request, response) => {
    try {
        const userId = request.user._id;

        // upload picture in cloudinary
        const uploadedImage = await pictureUpload(request.file.path);

        if (!uploadedImage) {
            console.log("upload failed");
            return res.status(500).json({
                error: "File couldn't be uploaded"
            })
        }
        //creating variable to saving its data in database art object 
        const artData = {
            nameOfThePainting: request.body.artname,
            nameOfTheAuthor: request.body.author,
            style: request.body.style,
            year: parseInt(request.body.year),
            picture: {
                secure_url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            },
            description: request.body.description,
            location: request.body.location,
            userWhoPostedArt: userId
        }
        let artObject;
        try {
            artObject = await ArtsModel.create(artData);
            console.log('artObject :>> ', artObject);
        } catch (error) {
            console.log("Error creating art object:", error);
        }

        try {
            const user = await UserModel.findById(userId);
            user.postedArtObjects.push(artObject._id);
            await user.save();
            console.log('USER :>> ', user);
        } catch (error) {
            console.log("Error saving referense to the user", error);
        }
        response.status(201).json({
            message: "Art object uploaded successfully",
            artObject,
        });
    } catch (error) {
        console.log(error);
    }
}

const getArtWithUser = async (req, res) => {

    try {
        const art = await UserModel.findById(req.user._id).populate("postedArtObjects");
        if (!art) {
            return res.status(404).json({ error: "Art not found" });
        }
        res.json(art.postedArtObjects);
    } catch (error) {
        console.error("Error fetching art:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const addArtObjectToFavoitesOfUser = async (req, res) => {
    const artObjectId = req.body.artId;
    try {
        const user = await UserModel.findById(req.user._id);
        user.favorites.push(artObjectId);
        await user.save();
        // i have to send the responsse
    } catch (error) {
        console.log("Error saving referense to the user", error);
    }
}


export { getAllArts, getArtByAuthorName, getArtByStyle, uploadArtObject, getArtWithUser, addArtObjectToFavoitesOfUser }