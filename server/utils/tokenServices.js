import jwt from "jsonwebtoken"

const issueToken = (userId) => {
    const payload = { sub: userId }
    const options = {
        expiresIn: "1 day",
        audience: "App users"

    }
    const secretOrPrivate = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretOrPrivate, options);
    return token
}

export { issueToken };