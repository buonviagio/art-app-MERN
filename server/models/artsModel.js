import mongoose from "mongoose";

const artsSchema = new mongoose.Schema({
    location: {
        type: String,
        require: true
    },
    nameOfTheAuthor: {
        type: String,
        requere: true
    },
    nameOfThePainting: {
        type: String,
        require: true
    },
    style: {
        type: String
    },
    year: {
        type: Number
    },
    picture: {
        type: Object
    },
    userWhoPostedArt: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const ArtsModel = mongoose.model("Art", artsSchema);

export default ArtsModel;