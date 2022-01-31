import * as jwt from "jsonwebtoken";

// Verify Auth
export async function verifyAuth (req, res, next) {

    const token = await req.headers.authorization.split(" ")[1];
    try {
        const data = await jwt.verify(token, process.env.SECRET_PHRASE);
        req._user = data;
        next();

    } catch {
        res.status(401).json({ "Error": "User unauthorize" });
    }
};