import ArtsModel from "../models/artsModel.js"
import UserModel from "../models/userModel.js";
import CommentModel from "../models/commentModel.js"
import mongoose from "mongoose";
import { response } from "express";

const createComment = async (request, response) => {
    try {
        const { artId } = request.params;
        const { text } = request.body;

        const artObject = await ArtsModel.findById(artId);

        if (!artObject) {
            return response.status(400).json({
                message: "We can not find Art Object to add your comment"
            })
        } else {
            const comment = await CommentModel.create({
                text: text,
                user: request.user._id,
                art: artObject._id,
            });
            return response.status(201).json({
                userId: comment.user._id,
                artId: comment.art,
                text: comment.text,
                createdAt: comment.created_at,
                updatedAt: comment.updated_at,
                commentId: comment._id,
            });
        }
    } catch (error) {
        console.log('error :>> ', error);
    }
}

const getAllComments = async (request, response) => {
    try {
        const { artId } = request.params;
        console.log('!!!!!!!!!!!!!!artId :>> ', artId);
        const comments = await CommentModel.find({ art: artId })
            .populate("user") // Populate user 
            // Latest comments first
            .sort({ created_at: -1 });
        if (comments.length > 0) {
            const formattedComments = comments.map(comment => ({
                userId: comment.user._id,
                userName: comment.user.name,
                avatar: comment.user.avatar.secure_url,
                artId: comment.art,
                text: comment.text,
                createdAt: comment.created_at,
                updatedAt: comment.updated_at,
                commentId: comment._id
            }));
            return response.status(200).json({
                message: "we found comments for this art object ",
                comments: formattedComments,
            });
        } else {
            return response.status(400).json({ message: "No comments yet. Be the first to comment!" })
        }

    } catch (error) {
        console.log(error);

    }
}

const deleteComment = async (request, response) => {
    const { commentId } = request.params;
    try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) return response.status(404).json({ message: "Comment not found" });

        // to ensure only the author can delete the comment
        if (comment.user._id.toString() !== request.user._id.toString()) {
            return response.status(403).json({ message: "You are unauthorized to delete this comment" });
        }

        await comment.deleteOne();

        response.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log("Error, can not delete comment", error);
    }
}

const changeComment = async (request, response) => {
    const { commentId } = request.params;
    const text = request.body.text;
    try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) return response.status(404).json({ message: "Comment not found" })

        if (comment.user._id.toString() !== request.user._id.toString()) {
            return response.status(403).json({ message: "You are unauthorized to edit this comment" });
        }

        comment.text = text;
        comment.updated_at = new Date();
        comment.save();

        return response.status(200).json({
            message: "Comment was succesfully changes",
            comment: comment
        })
        // code bellow does not work updated_at is not updated
        // const updatedComment = await comment.updateOne(
        //     { text: text },
        //     {
        //         updated_at: new Date()
        //     });

        // if (updatedComment)
        //     console.log("updatedComment", updatedComment);
    } catch (error) {
        console.log('error, we can not update comment :>> ', error);
    }
}

export { createComment, getAllComments, deleteComment, changeComment }