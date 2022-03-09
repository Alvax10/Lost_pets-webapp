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
export async function updateUserData(oldEmail, newEmail?, newPassword?) {

    console.log({
        oldEmail: oldEmail,
        newEmail: newEmail,
        newPassword: newPassword,
    });

    const authFounded = await Auth.findOne({
        where: { email: oldEmail }
    });

    if (newEmail && !newPassword) {

        await authFounded.update({
            email: newEmail,
        });
        
        
    } else if (newPassword && !newEmail) {
        await authFounded.update({
            password: getSHA256ofString(newPassword),
        });
        
        
    } else {
        await authFounded.update({
            email: newEmail,
            password: getSHA256ofString(newPassword),
        });
    }

    await authFounded.save();
}

// Add username y phone number to the user
export async function completeUserData(email, phone_number, username) {

    const findUser = await User.findOne({
        where: {
            email: email,
        }
    });
    await findUser.update({ phone_number: phone_number, username: username });
    await findUser.save();
}

// Sign Up
export async function createUser(email, password ) {

    const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: { email }
    });
    
    const [auth, authCreated] = await Auth.findOrCreate({
        where: { userId: user['id'] },
        defaults: {
            email,
            password: getSHA256ofString(password),
            userId: user['id'],
        }
        // se recomienda no mostrar el de auth ya que allí está la contraseña encriptada :D
    });
    console.log(user,auth);
    return authCreated;
}

// Sign In
export async function authenticateUser(email, password) {

    const auth = await Auth.findOne({
        where: { 
            email: email,
            password: getSHA256ofString(password)
        },
    });
    const token = await jwt.sign({ id: auth['userId'] }, process.env.SECRET_PHRASE);
    return token;
}

// Verify if user exists
export async function verifyIfUserExists(email) {

    const userFounded = await User.findOne({
        where: {
            email: email,
        }
    });
    if (userFounded) {
        return true;

    } else {
        return false;
    }
}
