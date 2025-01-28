import * as dotenv from "dotenv";
dotenv.config();

import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import UserModel from '../models/userModel.js';

const passportOptions = {
    // here we extract the token from Authorization header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

const passportStrategy = new JwtStrategy(passportOptions, async function (jwt_payload, done) {
    const user = await UserModel.findOne({ _id: jwt_payload.sub });
    // if we have no user, token is probably invalid
    if (!user) {
        const error = " no user was found with the information contained in token";
        return done(error, false)
    }
    if (user) {
        return done(null, user)
    }
})

export default passportStrategy