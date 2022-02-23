import { Mascot, User } from "../models/user-mascot";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";

export async function eliminateMascot(mascotId, objectID) {

    const mascotFound = await Mascot.findByPk(mascotId);
    await mascotFound.destroy();
    await index.deleteObject(objectID);

    return console.log("Mascot eliminated");
}

export async function mascotsCloseFrom(lat, lng) {

    if (lat && lng) {

        const hits = await index.search("", {
            aroundLatLng: [lat, lng].join(','),
            aroundRadius: 100000,
        });

        return hits["hits"];

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

        console.log(userFounded['id']);
        const allMascotsReported = await Mascot.findAll({
            where: { userId: userFounded['id'] }
        });
        // .catch((err) => {
        //     console.error("Si hay un error en el controller es este: ", err);
        // });

        return allMascotsReported;

    } else {
        console.error('Falta el userId o el mismo no existe');
    }
}

// Report a lost pet
export async function reportLostPet(petName, _geoloc, ImageDataURL, email) {

    console.log(petName, _geoloc, email);

    if (ImageDataURL && email) {
        
        const userFounded = await User.findOne({
            where: { email: email },
        });

        try {
            
            const imagen = await cloudinary.uploader.upload(ImageDataURL,
                {
                    resource_type: "image",
                    discard_original_filename: true,
                    timeout: 1500000,
                }
            );
            
            const mascotCreatedInAlgolia = await index.saveObject({
                petName: petName,
                _geoloc: _geoloc,
                userId: userFounded["id"],
            }, {
                autoGenerateObjectIDIfNotExist: true,
            });

            const mascot = await Mascot.create({
                petName: petName,
                _geoloc: _geoloc,
                ImageDataURL: imagen["secure_url"],
                userId: userFounded["id"],
                objectID: mascotCreatedInAlgolia["objectID"],
            });

            return mascot;
            
        } catch(e) {
            console.log("Este error ocurrió en reportar mascota: ", e);
        }

    } else {
        console.error('La imageDataURL no se está pasando bien');
    }
}

// update profile
export async function updateProfile(mascotId, objectID, petName, petPhoto, mascotLocation?) {

    if (mascotId && petName && petPhoto && mascotLocation) {

        try {

            let image;
            const imagen = await cloudinary.uploader.upload(petPhoto, function (error, result) {
                image = result.secure_url;
            })
            .catch((err) => {
                // console.log("Esto contiene imagen: ", imagen);
                console.log("Esto contiene el error: ", err)
            });
    
            const allDataComplete = {
                imageDataURL: image,
                petName: petName,
                _geoloc: mascotLocation,
            }
    
            const mascotUpdated = await index.partialUpdateObject({
                objectID: objectID,
                petName: petName,
                _geoloc: mascotLocation,
                ImageDataURL: imagen["secure_url"],
            });
            const petUpdated = await Mascot.update(allDataComplete,
            {
                where: {
                    id: mascotId,
                }
            });
    
            return petUpdated;

        }catch (e) {
            console.error("No se pudo editar la mascota: ", e);
        }
    }
}