import ArtsModel from "../models/artsModel.js"

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

export { getAllArts, getArtByAuthorName, getArtByStyle }