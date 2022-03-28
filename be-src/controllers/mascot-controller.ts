import { Mascot, User } from "../models/user-mascot";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";

export async function eliminateMascot(mascotId, objectID) {

    try {

        const mascotFound = await Mascot.findByPk(mascotId);
        await mascotFound.destroy();
        await index.deleteObject(objectID);
    
        return true;

    } catch (e) {
        console.error("Sucedió este error en eliminateMascot: ", e);
    }
}

export async function mascotsCloseFrom(lat, lng) {

    if (lat && lng) {

        const hits = await index.search("", {
            aroundLatLng: [lat, lng].join(','),
        })
        .catch((err) => {
            console.error("Hay un error en mascotsClose from: ", err);
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

        // console.log(userFounded['id']);
        const allMascotsReported = await Mascot.findAll({
            where: { userId: userFounded['id'] }
        })
        .catch((err) => {
            console.error("Hay un error en all reported pets by a user: ", err);
        });

        return allMascotsReported;

    } else {
        console.error('Falta el userId o el mismo no existe');
    }
}

// Report a lost pet
export async function reportLostPet(petName, _geoloc, ImageDataURL, email) {

    // console.log(petName, _geoloc, email);

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
                ImageDataURL: imagen["secure_url"],
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

            console.log(mascot);
            return mascot;
            
        } catch(e) {
            console.log("Este error ocurrió en reportar mascota: ", e);
        }

    } else {
        console.error('La imageDataURL no se está pasando bien');
    }
}

// update profile
export async function updateProfile(mascotId, objectID, petName, ImageDataURL, mascotLocation) {
    
    if (mascotId && objectID) {
        try {
            
            const petFounded = await Mascot.findByPk(mascotId);

            if (ImageDataURL !== null && mascotLocation["name"] !== null && mascotLocation["lat"] !== null && mascotLocation["lng"] !== null && petName !== null) {

                const imagen = await cloudinary.uploader.upload(ImageDataURL,
                    {
                        resource_type: "image",
                        discard_original_filename: true,
                        timeout: 1500000,
                    }
                );
                
                const mascotUpdated = await index.partialUpdateObject({
                    objectID: objectID,
                    _geoloc: mascotLocation,
                    petName: petName,
                    ImageDataURL: imagen["secure_url"],
                });

                const petUpdated = await petFounded.update({
                    ImageDataURL: imagen["secure_url"],
                    _geoloc: mascotLocation,
                    petName: petName,
                    objectID: objectID,
                });

                console.log("Mascota updateada");
                if (petUpdated) { return true } else { return false };
            }

            if (ImageDataURL !== null && mascotLocation["name"] !== null && mascotLocation["lat"] !== null && mascotLocation["lng"] !== null) {

                const imagen = await cloudinary.uploader.upload(ImageDataURL,
                    {
                        resource_type: "image",
                        discard_original_filename: true,
                        timeout: 1500000,
                    }
                );
                
                const mascotUpdated = await index.partialUpdateObject({
                    objectID: objectID,
                    _geoloc: mascotLocation,
                    ImageDataURL: imagen["secure_url"],
                });

                const petUpdated = await petFounded.update({
                    ImageDataURL: imagen["secure_url"],
                    _geoloc: mascotLocation,
                    objectID: objectID,
                });

                console.log("Mascota updateada");
                if (petUpdated) { return true } else { return false };
            }

            if (ImageDataURL !== null) {

                const imagen = await cloudinary.uploader.upload(ImageDataURL,
                    {
                        resource_type: "image",
                        discard_original_filename: true,
                        timeout: 1500000,
                    }
                );
                
                const mascotUpdated = await index.partialUpdateObject({
                    objectID: objectID,
                    ImageDataURL: imagen["secure_url"],
                });

                const petUpdated = await petFounded.update({
                    ImageDataURL: imagen["secure_url"],
                    objectID: objectID,
                });

                console.log("Mascota updateada");
                if (petUpdated) { return true } else { return false };
            }
            
            if (mascotLocation["name"] !== null && mascotLocation["lat"] !== null && mascotLocation["lng"] !== null) {
                console.log("MascotLocation: ", mascotLocation);

                const mascotUpdated = await index.partialUpdateObject({
                    objectID: objectID,
                    _geoloc: mascotLocation,
                });

                const petUpdated = await petFounded.update({
                    objectID: objectID,
                    _geoloc: mascotLocation,
                });

                console.log("Mascota updateada");
                if (petUpdated) { return true } else { return false };
            }

            console.log("PetName: ", petName);
            if (petName !== null) {

                const mascotUpdated = await index.partialUpdateObject({
                    objectID: objectID,
                    petName: petName,
                });

                const petUpdated = await petFounded.update({
                    objectID: objectID,
                    petName: petName,
                });

                console.log("Mascota updateada");
                if (petUpdated) { return true } else { return false };
            }
    
        } catch (e) {
            console.error("No se pudo editar la mascota: ", e);
            return false;
        }
    }
}