import { User } from "../models/user-mascot";


export async function getProfile(userId) {
    const userProfile = User.findByPk(userId);
    
    return userProfile;
}
