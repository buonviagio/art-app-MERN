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

export { getAllArts }