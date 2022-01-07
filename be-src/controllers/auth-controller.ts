import "dotenv/config";
import { Auth } from "../models/Auth";
import { User } from "../models/user-mascot";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

// Transform the password to hash
export function getSHA256ofString(text: string) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

// Update User Data
export async function updateUserData(email, newPassword) {

    if (email) {

        const findUser = await Auth.findOne({
            where: { email: email }
        });
        await findUser.update({ newPassword });
    }
}

// Add username y phone number to the user
export async function completeUserData(email, phone_number, username) {

    if (email && phone_number && username) {

        const findUser = await User.findOne({
            where: {
                email: email,
            }
        });
        await findUser.update({ phone_number: phone_number, username: username });
        await findUser.save();

    } else {
        console.error("Faltan datos en el body o el email es incorrecto");
    }
}

// Sign Up
export async function findOrCreateUser(email, password ) {

    if ( email && password ) {

        const [ user, created ] = await User.findOrCreate({
            where: { email },
            defaults: {
                email,
            }
        });
    
        const [ auth, authCreated ] = await Auth.findOrCreate({
            where: { userId: user['id'] },
            defaults: {
                email,
                password: getSHA256ofString(password),
                userId: user['id'],
            }
            // se recomienda no mostrar el de auth ya que allí está la contraseña encriptada :D
        });
        console.log(user, auth);
        return authCreated;

    } else {
        console.error('Faltan datos en el body');
    }
}

// Sign In
export async function authenticateUser(email, password) {

    if (email && password) {

        const auth = await Auth.findOne({
            where: { 
                email: email,
                password: getSHA256ofString(password)
            },
        });
        console.log(auth);
        const token = await jwt.sign({ id: auth['userId'] }, process.env.SECRET_PHRASE);

        return true && token;
    } else {
        return false;
    }
}

// Verify if user exists
export async function verifyIfUserExists(email) {

    if (email) {
        const userFounded = await User.findOne({
            where: {
                email: email,
            }
        })
        if (userFounded) {
            return true;

        } else {

            return false;
        }

    } else {
        console.error('falta el email');
    }
}

// Verify Password
export async function verifyAuth (req, res, next) {

    const token = await req.headers.authorization.split(" ")[1];
    try {
        const data = await jwt.verify(token, process.env.SECRET_PHRASE);
        req._user = data;
        next();

    } catch {
        res.status(401).json({ "Error": "User unauthorize" });
    }
    return token;
};