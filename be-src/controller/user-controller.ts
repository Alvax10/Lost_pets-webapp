import { User } from "../models/user";
import { cloudinary } from "../lib/cloudinary";

export async function updateProfile(userId, updateData) {

    if (updateData.imageDataURL) {

        const imagen = await cloudinary.uploader.upload(
            updateData.imageDataURL,
            {
                resource_type: 'image',
                discard_original_filename: true,
                width: 1000,
            }
        );
        const updateDataComplete = {
            name: updateData.name,
            bio: updateData.bio,
            ImageDataURL: imagen.secure_url,
        };

        await User.update(updateDataComplete,
        {
            where: {
                id: userId,
            }
        }
        ).catch((e) => {
            console.log(e);
        });
        return updateDataComplete;
    }
}

export async function getProfile(userId) {

    const userProfile = User.findByPk(userId);

    return userProfile;
}