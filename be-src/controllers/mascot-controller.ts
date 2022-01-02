import { Mascot, User } from "../models/user-mascot";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";

export async function mascotsCloseFrom(lat, lng) {

    if (lat && lng) {

        const hits = await index.search("", {
            aroundLatLng: [lat, lng].join(','),
            aroundRadius: 10000,
        });

        console.log(hits);
        return hits;

    } else {
        console.error("Falta lat, lng o ambos!");
    }
}

// get all reported pets by a user
export async function allReportedPetsByAUser(email) {

    if (email) {
        const userFounded = await User.findOne({
            where: { email: email },
        });

        const allMascotsReported = await Mascot.findAll({
            where: { userId: userFounded['id'] }
        })
        .catch((err) => {
            console.error("Si hay un error en el controller es este: ", err);
        });

        return allMascotsReported;

    } else {
        console.error('Falta el userId o el mismo no existe');
    }
}

// Report a lost pet
export async function reportLostPet(petName, _geoloc, imageDataURL, email) {

    if (imageDataURL && email) {
        
        const userFounded = await User.findOne({
            where: { email: email },
        });

        const imagen = await cloudinary.uploader.upload(imageDataURL, {

            resource_type: 'image',
            discard_original_filename: true,
            width: 200,
            hegiht: 100,
        })
        .catch((err) => {
            console.log("Esto contiene imagen: ", imagen);
            console.log("Esto contiene el error: ", err)
        });

        const mascotDataComplete = {
            name: petName,
            _geoloc: _geoloc,
            ImageDataURL: imagen["secure_url"],
            userId: userFounded["id"],
        };
        
        const mascotCreated = await index.saveObject(mascotDataComplete, {
            autoGenerateObjectIDIfNotExist: true,
        });

        await Mascot.create({
            default: {
                mascotDataComplete,
            }
        });
        
        console.log(mascotDataComplete);
        return mascotDataComplete;

    } else {
        console.error('La imageDataURL no se está pasando bien');
    }
}

// update profile
export async function updateProfile(mascotId, updateData) {

    if (updateData.imageDataURL) {

        const imagen = await cloudinary.uploader.upload(
            updateData.imageDataURL,
            {
                resource_type: 'image',
                discard_original_filename: true,
                width: 1000,
            }
        )
        .catch((err) => {
            console.log("Esto contiene imagen: ", imagen);
            console.log("Esto contiene el error: ", err)
        });

        const updateDataComplete = {
            name: updateData.name,
            _geoloc: updateData._geoloc,
            ImageDataURL: imagen["secure_url"],
        };

        const mascotUpdated = await index.partialUpdateObject(updateDataComplete);

        await Mascot.update(updateDataComplete,
        {
            where: {
                id: mascotId,
            }
        }
        ).catch((e) => {
            console.log(e);
        });

        return updateDataComplete;
    }
}