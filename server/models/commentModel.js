import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    art: { type: mongoose.Schema.Types.ObjectId, ref: 'Art', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;
