import ArtsModel from "../models/artsModel.js"
import UserModel from "../models/userModel.js";
import CommentModel from "../models/commentModel.js"
import { pictureUpload } from "../utils/pictureUpload.js";
import { pictureDelete } from "../utils/pictureDelete.js";
import { request } from "http";

const getAllArts = async (request, response) => {
    console.log("getAllArts Method");
    try {
        const allArts = await ArtsModel.find({});
        // recieve arts object in random sequence 
        // const allArts = await ArtsModel.aggregate([
        //     //  aggregation stage in Mongoose
        //     { $sample: { size: 50 } }
        // ]);

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
        console.log('error getArtByAuthorName :>> ', error);
    }
}

const getArtByStyle = async (request, response) => {
    const { style } = request.params;
    try {
        if (style !== "All styles") {
            const desiredArt = await ArtsModel.find({ style: style })
            return response.status(200).json({
                message: `this is what you are looking for`,
                desiredArt
            })
        } else if (style === "All styles") {
            const desiredArt = await ArtsModel.find({});
            return response.status(200).json({
                message: `this is all styles`,
                desiredArt
            })
        }
    } catch (error) {
        console.log('error getArtByStyle :>> ', error);
    }
}

const uploadArtObject = async (request, response) => {
    try {
        const userId = request.user._id;

        // upload picture in cloudinary
        const uploadedImage = await pictureUpload(request.file.path);

        if (!uploadedImage) {
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
        res.json(
            art.postedArtObjects
        );
    } catch (error) {
        console.error("Error fetching art:", error);
    }
};

const addArtObjectToFavoitesOfUser = async (req, res) => {
    const artObjectId = req.body.artId;
    try {
        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the art object is already in the favorites
        const isFavorite = user.favorites.includes(artObjectId);

        if (isFavorite) {
            // Remove the art object from the favorites
            user.favorites = user.favorites.filter((id) => id.toString() !== artObjectId);
        } else {
            // Add the art object to the favorites
            user.favorites.push(artObjectId);
        }

        //user.favorites.push(artObjectId);
        await user.save();

        return res.status(200).json({
            message: isFavorite
                ? "Art object removed from favorites"
                : "Art object added to favorites",
            favorites: user.favorites
        });
    } catch (error) {
        console.log("Error saving referense to the user", error);
    }
}

const getAllFavoriteArtObjecsOfUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await UserModel.findById(userId);
        //console.log('user.favorites :>> ', user.favorites);
        if (!user) {
            return res.status(404).json({ message: "User not found, to get favorites" });
        } else {
            return res.status(200).json({
                message: "Art object removed from favorites",
                favorites: user.favorites
            });
        }
    } catch (error) {
        console.log('Error, we can not find the user to get all his favorites', error);
    }
}

const getAllFavoriteArtObjecsOfUserForProfilePage = async (req, res) => {
    const userId = req.user._id;
    console.log('User ID from  getAllFavoriteArtObjecsOfUserForProfilePage:>> ', userId);
    try {
        // Find the user by ID and populate the `favorites` field
        const user = await UserModel.findById(userId).populate({
            // Field to populate
            path: 'favorites',
            // With wich Model populate 
            model: 'Art',
            // Exclude __v
            select: '-__v',
        });

        if (!user) {
            return res.status(404).json({ message: "Favorites object are not found" });
        } else {
            return res.status(200).json({
                message: "Favorites art objects were found",
                favorites: user.favorites
            });
        }
    } catch (error) {
        console.error('Error fetching user favorites objects for profile page:', error.message);
    }
}

const deleteArtObject = async (req, res) => {
    const artObjectId = req.body.artId;
    try {
        // St1 Find the art object
        const artObject = await ArtsModel.findById(artObjectId);
        if (!artObject) {
            return res.status(404).json({ message: "Art object to delete not found." });
        }

        // St2 Before saving the avatar picture we have to delete the previous one, if does it exist
        const publicIdOfThePicture = artObject.picture.public_id;
        if (publicIdOfThePicture) {
            console.log("PICTURE WAS DELETED");
            await pictureDelete(publicIdOfThePicture);
        }

        // St3 Remove the art object from the database
        await ArtsModel.findByIdAndDelete(artObjectId);

        // St4 Remove the art reference from all users' `favorites` arrays in one operation
        const favoritesUpdateResult = await UserModel.updateMany(
            { favorites: artObjectId },
            { $pull: { favorites: artObjectId } }
        );

        // St5 Remove the art reference from the poster's `postedArtObjects` array
        const postedArtUpdateResult = await UserModel.updateOne(
            { _id: artObject.userWhoPostedArt },
            { $pull: { postedArtObjects: artObjectId } }
        );

        return res.status(200).json({
            message: "Art object deleted successfully.",
            details: {
                favoritesUpdated: favoritesUpdateResult,
                postedArtUpdated: postedArtUpdateResult,
            },
        });
    } catch (error) {
        console.error("Error deleting art object:", error);
    }
}

const updateArtObject = async (request, response) => {
    try {
        const { artifactId, artphoto, artname, author, style, year, location, description } = request.body;

        const updateData = {};
        //we will update only that fields, that hasvalues
        if (artname && artname !== "") updateData.nameOfThePainting = artname;
        if (author && author !== "") updateData.nameOfTheAuthor = author;
        if (style && style !== "") updateData.style = style;
        if (year && year !== "") updateData.year = year;
        if (location && location !== "") updateData.location = location;
        if (description && description !== "") updateData.description = description;

        //if user upload image, first we delete previous one, and than upload new one
        const artObj = await ArtsModel.findById(artifactId);
        if (artObj.picture.public_id && artphoto !== "") {
            await pictureDelete(artObj.picture.public_id);
            const uploadedImage = await pictureUpload(request.file.path);

            updateData.picture = {
                secure_url: uploadedImage.secure_url,
                public_id: uploadedImage.public_id
            }
        }

        const artObject = await ArtsModel.findByIdAndUpdate(artifactId, updateData, { new: true });
        if (artObject) {
            return response.status(200).json({
                message: "Art object was updated succesfully",
                artObject: artObject,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const getArtByID = async (request, response) => {
    const { id } = request.params;
    try {
        if (id) {
            const desiredArt = await ArtsModel.findById(id)
            return response.status(200).json({
                message: `this is what you are looking for`,
                desiredArt
            })
        }
    } catch (error) {
        console.log('error :>> ', error);
    }
}

const getArtObjectsBasedOnUserLikes = async (request, response) => {
    try {
        // Step 1: Populate the 'favorites' field to get the art objects
        // Using lean() to convert to plain js
        const users = await UserModel.find({}).populate('favorites').lean();

        const mapCollection = new Map();

        users.forEach((user) => {
            user.favorites.forEach((art) => {
                mapCollection.set(art._id.toString(), (mapCollection.get(art._id.toString()) || 0) + 1)
            })
        })

        // Step2: Find all object, using lean() to perform operation on js object
        const allArtsObjects = await ArtsModel.find({}).lean();

        // Step 3: adding to each artObject amount of likes
        const mostLikedArts = allArtsObjects.map((artObjects) => (
            { ...artObjects, likes: mapCollection.get(artObjects._id.toString()) || 0 }
        ));

        // Step 4: sort all objects with likes
        mostLikedArts.sort((obj1, obj2) => obj2.likes - obj1.likes);

        return response.status(200).json({
            message: "Most liked arrt objects",
            mostLikedArts
        })

    } catch (error) {
        console.log('error in the methos getArtObjectsBasedOnUserLikes:>> ', error);
    }
}

const getArtObjectsMostCommented = async (request, response) => {
    console.log("getArtObjectsMostCommented method");
    try {
        // Step 1: Populate the 'art' field to get the comments
        // Using lean() to convert to plain js
        const comments = await CommentModel.find({}).populate('art').lean();

        const mapCollection = new Map();

        comments.forEach((comment) => {
            mapCollection.set(comment.art._id.toString(), (mapCollection.get(comment.art._id.toString()) || 0) + 1)
        })

        // Step2: Find all object, using lean() to perform operation on js object
        const allArtsObjects = await ArtsModel.find({}).lean();

        // Step 3: adding to each artObject amount of comments
        const mostCommentedArts = allArtsObjects.map((artObjects) => (
            { ...artObjects, amountOfComments: mapCollection.get(artObjects._id.toString()) || 0 }
        ));

        // Step 4: sort all objects with likes
        mostCommentedArts.sort((obj1, obj2) => obj2.amountOfComments - obj1.amountOfComments);

        return response.status(200).json({
            message: "Most commented arts objects",
            mostCommentedArts
        })

    } catch (error) {
        console.log('error in the methos getArtObjectsBasedOnUserLikes:>> ', error);
    }
}

const getArtObjectsDescendingSequence = async (request, response) => {

    try {
        // getting all art objects sorted by year in descending order -1
        const arts = await ArtsModel.find().sort({ year: -1 });

        if (arts) return response.status(200).json({
            message: "Arts in descending sequence",
            arts
        });
    } catch (error) {
        console.log("Error fetching arts:", error);
    }
}

const getArtObjectsAscendingSequence = async (request, response) => {

    try {
        // getting all art objects sorted by year in descending order -1
        const arts = await ArtsModel.find().sort({ year: 1 });

        if (arts) return response.status(200).json({
            message: "Arts in descending sequence",
            arts
        });
    } catch (error) {
        console.log("Error fetching arts:", error);
    }
}

const getArtObjectsByItsName = async (request, response) => {
    const { nameOfArt } = request.params;
    try {
        if (nameOfArt) {
            const desiredArt = await ArtsModel.find({ nameOfThePainting: { $regex: nameOfArt, $options: 'i' } })
            return response.status(200).json({
                message: `this is what you are looking for`,
                desiredArt
            })
        }
    } catch (error) {
        console.log('error getArtObjectsByItsName :>> ', error);
    }
}

export { getAllArts, getArtByAuthorName, getArtByStyle, uploadArtObject, getArtWithUser, addArtObjectToFavoitesOfUser, getAllFavoriteArtObjecsOfUser, deleteArtObject, getAllFavoriteArtObjecsOfUserForProfilePage, updateArtObject, getArtByID, getArtObjectsBasedOnUserLikes, getArtObjectsMostCommented, getArtObjectsDescendingSequence, getArtObjectsAscendingSequence, getArtObjectsByItsName }