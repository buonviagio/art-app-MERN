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
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: true
    },
    picture: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    description: {
        type: String,
        require: true
    },
    userWhoPostedArt: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        require: true
    }
})

const ArtsModel = mongoose.model("Art", artsSchema);

export default ArtsModel;