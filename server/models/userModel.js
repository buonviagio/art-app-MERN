import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },

    avatar: {
        secure_url: { type: String, required: false },
        public_id: { type: String, required: false }
    },

    postedArtObjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Art' }],

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Art' }]
}, {
    timestamps: {
        createdAt: 'created_at', // Use created_at to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;