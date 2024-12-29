import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import { pictureUpload } from "../utils/pictureUpload.js";
import { encryptPassword, isPasswordCorrect } from "../utils/passwordServices.js";
import { issueToken } from "../utils/tokenServices.js";

const avatarUpload = async (req, res) => {
    console.log('req :>> ', req.file);
    try {
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
                avatar: {
                    secure_url: uploadedImage.secure_url,
                    public_id: uploadedImage.public_id
                }
            })
        }
    } catch (error) {
        console.log("upload failed");
        return res.status(500).json({
            error: `Something went wrong ${error}`
        })
    }

}

//function with method populate()
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

const register = async (req, res) => {
    const { email, password, avatar, userName } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email: email })
        if (existingUser) {
            console.log("YOU HAVE AN ACCOUNT");
            return res.status(400).json({
                message: "Sorry, email already in use",
            })
        }
        if (!existingUser) {
            const hashedPassword = await encryptPassword(password);

            if (!hashedPassword) {
                return res.status(500).json({
                    error: "Sorry, sorry try again later",
                })
            }
            if (hashedPassword) {
                const newUser = new UserModel({
                    email: email,
                    password: hashedPassword,
                    avatar: avatar,
                    name: userName
                });
                const storedUser = await newUser.save();
                return res.status(201).json({
                    message: "User successfully registered",
                    user: storedUser
                })
            }
        }
    } catch (error) {
        console.log("Error from method register =>", error);
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;
    //1 Input validation

    //2 Check if user exist in our users collection
    try {
        const existingUser = await UserModel.findOne({ email: email });
        //console.log('existingUser :>> ', existingUser);
        if (!existingUser) {
            return res.status(400).json({
                message: "You have to register"
            })
        }
        if (existingUser) {
            //3 Check the passwor
            const isPassOk = await isPasswordCorrect(password, existingUser.password);

            console.log("isPassOk", isPassOk);
            if (!isPassOk) {
                return res.status(400).json({
                    message: "Password is incorrect"
                });
            }
            //4 Generate the token

            if (isPassOk) {
                const token = issueToken(existingUser._id);

                if (!token) {
                    return res.status(500).json({
                        error: "token was not created"
                    });
                }
                if (token) {
                    //5. send to client confirm uuser login
                    return res.status(200).json({
                        message: "token was succesfully created",
                        user: {
                            userName: existingUser.userName,
                            email: existingUser.email,
                            avatar: existingUser.avatar
                        },
                        token
                    })
                }
            }

        }
    } catch (error) {
        return res.status(500).json({
            error: error
        })
    }
}

const getProfile = async (req, res) => {
    console.log('req :>> ', req);

}

export { avatarUpload, getUserWithPostedArts, register, login, getProfile };